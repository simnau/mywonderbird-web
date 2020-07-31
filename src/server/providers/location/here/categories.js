const HISTORICAL_MONUMENTS = '300-3000-0025';
const TOURIST_ATTRACTION = '300-3000-0023';
const LANDMARK_ATTRACTION = '300-3000-0000';
const BODY_OF_WATER = '300-3500';
const MOUNTAIN_OR_HILL = '300-3510';
const UNDERSEA_FEATURE = '300-3520';
const FOREST_OTHER = '300-3522';
const NATURAL_GEOGRAPHICAL = '300-3550';
const MUSEUMS = '300-3100';
const RELIGIOUS_PLACE = '300-3200';
const GALLERY = '300-3000-0024';
const PARKS = '550-5510-0202';
const BEACHES = '550-5510-0205';
const SCENIC_POINT = '550-5510-0242';
const TRAIL_START = '550-5510-0359';
const LEISURE_PLACES = '500-5520';

const CATEGORIES = [
  PARKS,
  MOUNTAIN_OR_HILL,
  FOREST_OTHER,
  BEACHES,
  TRAIL_START,
  NATURAL_GEOGRAPHICAL,
  LANDMARK_ATTRACTION,
  SCENIC_POINT,
  BODY_OF_WATER,
  HISTORICAL_MONUMENTS,
  TOURIST_ATTRACTION,
  UNDERSEA_FEATURE,
  LEISURE_PLACES,
  MUSEUMS,
  RELIGIOUS_PLACE,
  GALLERY,
];

const CATEGORIES_STRING = CATEGORIES.join(',');

module.exports = {
  CATEGORIES,
  CATEGORIES_STRING,
};