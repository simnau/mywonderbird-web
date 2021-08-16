const { rearrangeToStartFromPlace } = require('./geo');

describe('util/geo', () => {
  describe('rearangeToStartFromPlace', () => {
    it('makes the selected place the first and the furthest place from it the last', () => {
      const locations = [
        { id: 1, lat: 1, lng: 1 },
        { id: 2, lat: 2, lng: 2 },
        { id: 3, lat: 3, lng: 3 },
        { id: 4, lat: 4, lng: 4 },
      ];
      const startingPlaceId = 3;

      const result = rearrangeToStartFromPlace(locations, startingPlaceId);

      expect(result).toEqual([
        { id: 3, lat: 3, lng: 3 },
        { id: 2, lat: 2, lng: 2 },
        { id: 4, lat: 4, lng: 4 },
        { id: 1, lat: 1, lng: 1 },
      ]);
    });

    it('does not change anything when there is only one location', () => {
      const result = rearrangeToStartFromPlace([{ id: 1, lat: 1, lng: 1 }], 1);

      expect(result).toEqual([{ id: 1, lat: 1, lng: 1 }]);
    });

    it('switches the locations when there are only two locations', () => {
      const result = rearrangeToStartFromPlace(
        [{ id: 1, lat: 1, lng: 1 }, { id: 2, lat: 2, lng: 2 }],
        2,
      );

      expect(result).toEqual([
        { id: 2, lat: 2, lng: 2 },
        { id: 1, lat: 1, lng: 1 },
      ]);
    });

    it('returns an empty array when the locations array is null', () => {
      const result = rearrangeToStartFromPlace(null, 1);

      expect(result).toEqual([]);
    });

    it('returns an empty array when the locations array is empty', () => {
      const result = rearrangeToStartFromPlace([], 2);

      expect(result).toEqual([]);
    });
  });
});
