const sequelize = require('../../setup/sequelize');
const {
  Bookmark,
  BOOKMARK_TYPE_GEM_CAPTURE,
} = require('../../orm/models/bookmark');
const { BookmarkGroup } = require('../../orm/models/bookmark-group');
const bookmarkService = require('../bookmark/service');
const gemCaptureService = require('../gem-capture/service');

const GEM_CAPTURE_INCLUDE_MODELS = [
  {
    model: Bookmark,
    as: 'bookmarks',
  },
];

const INCLUDE_ORDER = [
  [{ model: Bookmark, as: 'bookmarks' }, 'createdAt', 'ASC'],
];

const DEFAULT_GEM_CAPTURE_BOOKMARK_GROUP = {
  id: null,
  title: 'All other',
};

async function findGemCaptureBookmarkGroups(userId) {
  let bookmarkGroups = await BookmarkGroup.scope('gemCapture').findAll({
    where: {
      userId,
    },
    include: GEM_CAPTURE_INCLUDE_MODELS,
    order: [['updatedAt', 'DESC'], ...INCLUDE_ORDER],
  });

  const defaultGroupBookmarks = await bookmarkService.findByUserIdAndBookmarkGroupId(
    userId,
    null,
  );

  bookmarkGroups = [
    { ...DEFAULT_GEM_CAPTURE_BOOKMARK_GROUP, bookmarks: defaultGroupBookmarks },
    ...bookmarkGroups,
  ];

  return Promise.all(
    bookmarkGroups.map(async bookmarkGroup => {
      const { bookmarks, ...rawBookmarkGroup } = bookmarkGroup.toJSON
        ? bookmarkGroup.toJSON()
        : bookmarkGroup;
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
  return sequelize.transaction(async transaction => {
    await bookmarkService.deleteByBookmarkGroupId(id, { transaction });
    return BookmarkGroup.destroy({
      where: {
        id,
      },
      transaction,
    });
  });
}

module.exports = {
  findGemCaptureBookmarkGroups,
  findyById,
  createGemCaptureBookmarkGroup,
  deleteById,
};
