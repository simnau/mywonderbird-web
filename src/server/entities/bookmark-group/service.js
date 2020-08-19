const {
  Bookmark,
  BOOKMARK_TYPE_GEM_CAPTURE,
} = require('../../orm/models/bookmark');
const { BookmarkGroup } = require('../../orm/models/bookmark-group');
const gemCaptureService = require('../gem-capture/service');

const GEM_CAPTURE_INCLUDE_MODELS = [
  {
    model: Bookmark,
    as: 'bookmarks',
  },
];

async function findGemCaptureBookmarkGroups(userId) {
  const bookmarkGroups = await BookmarkGroup.scope('gemCapture').findAll({
    where: {
      userId,
    },
    include: GEM_CAPTURE_INCLUDE_MODELS,
    order: [['updatedAt', 'DESC']],
  });

  return Promise.all(
    bookmarkGroups.map(async bookmarkGroup => {
      const { bookmarks, ...rawBookmarkGroup } = bookmarkGroup.toJSON();
      const [bookmark] = bookmarks;
      let imageUrl;

      // TODO: do this in one batch rather than one by one
      if (bookmark) {
        const gemCapture = await gemCaptureService.findById(bookmark.entityId);

        if (gemCapture) {
          imageUrl = gemCapture.url;
        }
      }

      return {
        ...rawBookmarkGroup,
        bookmarkCount: bookmarks.length,
        imageUrl,
      };
    }),
  );
}

async function findyById(id) {
  return BookmarkGroup.findByPk(id);
}

async function createGemCaptureBookmarkGroup({ userId, title }) {
  const createdBookmarkGroup = await BookmarkGroup.create({
    userId,
    title,
    type: BOOKMARK_TYPE_GEM_CAPTURE,
  });

  return {
    ...createdBookmarkGroup.toJSON(),
    bookmarkCount: 0,
  };
}

async function deleteById(id) {
  return BookmarkGroup.destroy({
    where: {
      id,
    },
  });
}

module.exports = {
  findGemCaptureBookmarkGroups,
  findyById,
  createGemCaptureBookmarkGroup,
  deleteById,
};
