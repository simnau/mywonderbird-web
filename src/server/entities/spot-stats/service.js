const gemService = require('../gem/service');
const likeService = require('../like/service');

async function findSpotsByUserId({ userId }) {
  const spots = await gemService.findSpotsByUserId({ userId });
  const gemCaptureIds = spots.map(({ firstGemCaptureId }) => firstGemCaptureId);
  const likesByGemCaptureIds = await likeService.countByGemCaptureIds(
    gemCaptureIds,
  );

  return spots.map(spot =>
    toSpotStatsDto(spot, likesByGemCaptureIds[spot.firstGemCaptureId] || 0),
  );
}

function toSpotStatsDto(spot, likeCount) {
  return {
    id: spot.id,
    imageUrl: spot.imageUrl,
    countryCode: spot.countryCode,
    country: spot.country,
    firstGemCaptureId: spot.firstGemCaptureId,
    likeCount,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
  };
}

module.exports = {
  findSpotsByUserId,
};
