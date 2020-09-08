const bookmarkService = require('../bookmark/service');
const gemCaptureService = require('../gem-capture/service');
const geoService = require('../geo/service');

async function suggestJourney(userId, bookmarkGroupId) {
  const bookmarks = await bookmarkService.findByUserIdAndBookmarkGroupId(
    userId,
    bookmarkGroupId,
    { attributes: ['entityId'] },
  );
  const gemCaptureIds = bookmarks.map(bookmark => bookmark.entityId);
  const gemCaptures = await gemCaptureService.findByIds(gemCaptureIds);

  if (!gemCaptures.length) {
    return {};
  }

  const firstGemCapture = gemCaptures[0];
  const gem = firstGemCapture.gem;
  const country = geoService.getLabelBy3LetterCountryCode(gem.countryCode);

  return {
    name: `Trip to ${country}`,
    country: country,
    countryCode: gem.countryCode,
    imageUrl: firstGemCapture.url,
    locations: gemCaptures.map(toLocation),
  };
}

function toLocation(gemCapture) {
  const gem = gemCapture.gem;
  const country = geoService.getLabelBy3LetterCountryCode(gem.countryCode);

  return {
    id: gemCapture.id,
    country,
    countryCode: gem.countryCode,
    name: gemCapture.title,
    imageUrl: gemCapture.url,
    location: {
      lat: gem.lat,
      lng: gem.lng,
    },
  };
}

module.exports = {
  suggestJourney,
};
