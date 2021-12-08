const sequelize = require('../../setup/sequelize');
const { flatMap, unique, indexBy } = require('../../util/array');
const {
  uploadFile,
  uploadFilesMap,
  imagePathToImageUrl,
} = require('../../util/file-upload');
const gemService = require('../gem/service');
const gemCaptureService = require('../gem-capture/service');
const placeService = require('../place/service');
const likeService = require('../like/service');
const bookmarkService = require('../bookmark/service');
const profileService = require('../profile/service');
const journeyService = require('../journey/service');
const geoService = require('../geo/service');
const { SINGLE_SHARE_FOLDER } = require('../../constants/s3');
const service = require('../gem/service');
const { deleteFiles, deleteFolder } = require('../../util/s3');

async function sharePicture(
  { title, imagePath, location, creationDate },
  journeyId,
  userId,
  { transaction } = {},
) {
  const lastGem = await gemService.findLastForJourney(journeyId);

  const sequenceNumber = lastGem ? lastGem.sequenceNumber + 1 : 0;

  const gem = {
    title,
    countryCode: location.countryCode,
    lat: location.lat,
    lng: location.lng,
    sequenceNumber,
    journeyId,
    createdAt: creationDate,
    updatedAt: creationDate,
    gemCaptures: [
      {
        title,
        imagePath,
        sequenceNumber: 0,
      },
    ],
  };

  const tx = transaction || (await sequelize.transaction());

  try {
    const createdGem = await gemService.create(gem, tx);
    await placeService.createFromGem(createdGem.toJSON(), location, userId, tx);

    if (!transaction) {
      await tx.commit();
    }

    return createdGem;
  } catch (e) {
    if (!transaction) {
      await tx.rollback();
    }

    throw e;
  }
}

async function sharePictureWithJourney({
  picture,
  journeyId,
  journeyTitle,
  userId,
  files,
}) {
  if (!files) {
    throw new Error('No images provided when sharing');
  }

  if (journeyId) {
    const {
      parsedImages: [uploadedImage],
    } = await uploadFiles(files, journeyId);

    return sharePicture(
      {
        ...picture,
        imagePath: uploadedImage.pathname,
      },
      journeyId,
      userId,
    );
  } else {
    const transaction = await sequelize.transaction();

    try {
      const savedJourney = await journeyService.create(
        {
          title: journeyTitle,
          startDate: new Date(),
          userId,
          creatorId: userId,
          draft: false,
        },
        {
          transaction,
        },
      );

      const {
        parsedImages: [uploadedImage],
      } = await uploadFiles(files, savedJourney.id);
      await sharePicture(
        {
          ...picture,
          imagePath: uploadedImage.pathname,
        },
        savedJourney.id,
        userId,
        { transaction },
      );

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }
}

async function uploadAndExtendPictureDatas({ pictureDatas, files, folder }) {
  const { parsedImages } = await uploadFilesMap(files, folder);

  const pictures = pictureDatas.map(({ imageIds, ...pictureData }) => {
    const imagePaths = imageIds
      .map(imageId => {
        const image = parsedImages[imageId];

        if (!image || !image.pathname) {
          return null;
        }

        return image.pathname;
      })
      .filter(image => !!image);

    return {
      ...pictureData,
      imagePaths: imagePaths,
    };
  });

  return pictures;
}

async function sharePictures({
  pictures,
  journeyId = null,
  userId,
  transaction,
}) {
  const lastGem = journeyId
    ? await gemService.findLastForJourney(journeyId)
    : null;

  const gems = await Promise.all(
    pictures.map(
      async ({ title, imagePaths, location, creationDate }, index) => {
        const { lat, lng } = location;
        let { countryCode } = location;

        if (!countryCode && (lat || lat === 0) && (lng || lng === 0)) {
          const location = `${lat},${lng}`;
          const herePlace = await geoService.locationToAddress(location);

          if (herePlace) {
            countryCode = herePlace.countryCode;
          }
        }

        return {
          title,
          countryCode,
          lat,
          lng,
          sequenceNumber: lastGem ? lastGem.sequenceNumber + index + 1 : index,
          journeyId,
          createdAt: creationDate,
          updatedAt: creationDate,
          userId,
          gemCaptures: imagePaths.map((imagePath, gemCaptureIndex) => {
            const timestamp = new Date(
              Date.now() + index * 100 + gemCaptureIndex,
            );

            return {
              title,
              imagePath,
              sequenceNumber: gemCaptureIndex,
              createdAt: timestamp,
              updatedAt: timestamp,
            };
          }),
        };
      },
    ),
  );

  const tx = transaction || (await sequelize.transaction());

  try {
    const createdGems = await service.bulkCreate(gems, tx);

    const gemsWithLocations = createdGems.map((gem, index) => {
      const location = pictures[index].location;

      return {
        ...gem.toJSON(),
        location,
      };
    });

    await placeService.createFromGems(gemsWithLocations, userId, tx);

    if (!transaction) {
      await tx.commit();
    }

    return createdGems;
  } catch (e) {
    if (!transaction) {
      await tx.rollback();
    }

    throw e;
  }
}

async function rollbackPictureUploads(pictureDatas) {
  if (!pictureDatas || !pictureDatas.length) {
    return;
  }

  const pictureUrls = unique(
    flatMap(pictureDatas, pictureData => {
      return pictureData.imagePaths;
    }),
  );

  deleteFiles(pictureUrls);
}

async function sharePicturesWithJourney({
  pictureDatas,
  journeyId,
  journeyTitle,
  userId,
  files,
}) {
  if (!files) {
    throw new Error('No images provided when sharing');
  }

  let transaction;
  let journey;
  let pictures;

  try {
    if (!journeyId) {
      transaction = await sequelize.transaction();
      journey = await journeyService.create(
        {
          title: journeyTitle,
          startDate: new Date(),
          userId,
          creatorId: userId,
          draft: false,
        },
        {
          transaction,
        },
      );
    }

    const localJourneyId = journeyId || journey.id;

    pictures = await uploadAndExtendPictureDatas({
      pictureDatas,
      files,
      folder: localJourneyId,
    });

    const result = await sharePictures({
      pictures,
      journeyId: localJourneyId,
      userId,
      transaction,
    });

    if (transaction) {
      await transaction.commit();
    }

    return result;
  } catch (e) {
    if (transaction) {
      await transaction.rollback();
    }

    if (journey) {
      deleteFolder(journey.id);
    } else {
      rollbackPictureUploads(pictures);
    }

    throw e;
  }
}

async function shareSinglePicture({
  picture: { title, location, creationDate },
  userId,
  files,
}) {
  const {
    parsedImages: [uploadedImage],
  } = await uploadFiles(files, SINGLE_SHARE_FOLDER);

  const gem = {
    title,
    countryCode: location.countryCode,
    lat: location.lat,
    lng: location.lng,
    sequenceNumber: 0,
    createdAt: creationDate,
    updatedAt: creationDate,
    userId,
    gemCaptures: [
      {
        title,
        imagePath: uploadedImage.pathname,
        sequenceNumber: 0,
      },
    ],
  };

  const tx = await sequelize.transaction();

  try {
    const createdGem = await gemService.create(gem, tx);
    await placeService.createFromGem(createdGem.toJSON(), location, userId, tx);

    await tx.commit();

    return createdGem;
  } catch (e) {
    await tx.rollback();
    throw e;
  }
}

async function shareSinglePictures({ pictureDatas, userId, files }) {
  if (!files) {
    throw new Error('No images provided when sharing');
  }

  const pictures = await uploadAndExtendPictureDatas({
    pictureDatas,
    files,
    folder: SINGLE_SHARE_FOLDER,
  });

  return sharePictures({
    pictures,
    userId,
  });
}

async function uploadFiles(files, folder) {
  return uploadFile(files, folder);
}

async function findFeedItems(lastDatetime, limit, direction) {
  const gemCaptures = await gemCaptureService.findFeedItems(
    lastDatetime,
    limit,
    direction,
  );

  return gemCaptures;
}

async function findFeedItemsV2(lastDatetime, limit, direction) {
  const gemCaptures = await gemCaptureService.findFeedItemsV2(
    lastDatetime,
    limit,
    direction,
  );

  return gemCaptures;
}

async function augmentFeed(gemCaptures, userId) {
  const gemCaptureIds = unique(gemCaptures.map(gemCapture => gemCapture.id));
  const { likeCounts, groupedUserLikes } = await getLikeStats(
    gemCaptureIds,
    userId,
  );
  const groupedUserBookmarks = await getBookmarkStats(gemCaptureIds, userId);
  const groupedProfiles = await getUserProfiles(gemCaptures);

  const augmented = gemCaptures.map(gemCapture => {
    const rawGemCapture = gemCapture.toJSON();
    const gemUserId = gemCapture.gem.journeyId
      ? gemCapture.gem.journey.userId
      : gemCapture.gem.userId;

    const rawUser = groupedProfiles[gemUserId]
      ? groupedProfiles[gemUserId].toJSON
        ? groupedProfiles[gemUserId].toJSON()
        : groupedProfiles[gemUserId]
      : null;

    return {
      ...rawGemCapture,
      likeCount: likeCounts[gemCapture.id],
      isLiked: groupedUserLikes[gemCapture.id] || false,
      isBookmarked: groupedUserBookmarks[gemCapture.id] || false,
      userId: gemUserId,
      userAvatarUrl: rawUser && rawUser.avatarUrl,
    };
  });

  return Promise.all(augmented.map(toFeedDto));
}

async function getLikeStats(gemCaptureIds, userId) {
  const [likeCounts, likesByUser] = await Promise.all([
    likeService.countByGemCaptureIds(gemCaptureIds),
    likeService.findByGemCaptureIdsAndUserId(gemCaptureIds, userId, {
      attributes: ['entityId'],
    }),
  ]);
  const groupedUserLikes = likesByUser.reduce((result, item) => {
    return {
      ...result,
      [item.entityId]: true,
    };
  }, {});

  return {
    likeCounts,
    groupedUserLikes,
  };
}

async function getBookmarkStats(gemCaptureIds, userId) {
  const bookmarksByUser = await bookmarkService.findByGemCaptureIdsAndUserId(
    gemCaptureIds,
    userId,
    {
      attributes: ['entityId'],
    },
  );

  return bookmarksByUser.reduce((result, item) => {
    return {
      ...result,
      [item.entityId]: true,
    };
  }, {});
}

async function getUserProfiles(gemCaptures) {
  const userIds = unique(
    gemCaptures.map(gemCapture => {
      return gemCapture.gem.journeyId
        ? gemCapture.gem.journey.userId
        : gemCapture.gem.userId;
    }),
  );

  const profiles = await profileService.findProfilesByProviderIds(userIds);

  return indexBy(profiles, 'providerId');
}

async function toFeedDto(feedItem) {
  const country = await gemService.getGemCountry(feedItem.gem);

  return {
    id: feedItem.id,
    journeyId: feedItem.gem ? feedItem.gem.journeyId : null,
    imageUrl: feedItem.imagePath
      ? imagePathToImageUrl(feedItem.imagePath)
      : feedItem.url,
    title: feedItem.gem ? feedItem.gem.title : feedItem.title,
    country,
    updatedAt: feedItem.updatedAt,
    likeCount: feedItem.likeCount || 0,
    isLiked: feedItem.isLiked,
    isBookmarked: feedItem.isBookmarked,
    userId: feedItem.userId,
    userAvatarUrl: feedItem.userAvatarUrl,
    locationId: feedItem.gemId,
  };
}

module.exports = {
  sharePicture,
  sharePictureWithJourney,
  sharePicturesWithJourney,
  shareSinglePicture,
  shareSinglePictures,
  uploadFiles,
  findFeedItems,
  findFeedItemsV2,
  augmentFeed,
};
