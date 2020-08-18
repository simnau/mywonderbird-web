const {
  Bookmark,
  BOOKMARK_TYPE_GEM_CAPTURE,
} = require('../../orm/models/bookmark');
const { BookmarkGroup } = require('../../orm/models/bookmark-group');

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

  return bookmarkGroups.map(bookmarkGroup => {
    const { bookmarks, ...rawBookmarkGroup } = bookmarkGroup.toJSON();

    return {
      ...rawBookmarkGroup,
      bookmarkCount: bookmarks.length,
    };
  });
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
