const { Place } = require('../models/place');
const { PlaceImage } = require('../models/place-image');
const { PlaceTag } = require('../models/place-tag');
const geohash = require('ngeohash');

const {
  FOOD_ID,
  CULTURE_ID,
  SPORTS_ID,
  NIGHTLIFE_ID,
  HIDDEN_GEMS_ID,
  MUSEUMS_ID,
  ARCHITECTURE_ID,
  VIEWPOINTS_ID,
} = require('./20201017112604-tags');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Place.bulkCreate(
      [
        {
          title: "O'Learys",
          countryCode: 'LTU',
          lat: 54.7106018068,
          lng: 25.2633426525,
          geohash: geohash.encode(54.7106018068, 25.2633426525, 7),
          placeImages: [
            {
              title: "O'Learys",
              url:
                'https://s1.15min.lt/images/photos/2019/09/02/original/olearys-sporto-baras-ir-restoranas-5d6d0ddbae8cb.jpg',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: SPORTS_ID,
            },
            {
              tagId: FOOD_ID,
            },
          ],
        },
        {
          title: 'Bonobo',
          countryCode: 'LTU',
          lat: 54.648161,
          lng: 25.214526,
          geohash: geohash.encode(54.648161, 25.214526, 7),
          placeImages: [
            {
              title: 'Bonobo',
              url:
                'https://media-cdn.tripadvisor.com/media/photo-m/1280/14/67/29/e0/bonobo-climbers.jpg',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: SPORTS_ID,
            },
          ],
        },
        {
          title: 'Vertical Climbing Center',
          countryCode: 'LTU',
          lat: 54.718763,
          lng: 25.290145,
          geohash: geohash.encode(54.718763, 25.290145, 7),
          placeImages: [
            {
              title: 'Vertical Climbing Center',
              url:
                'https://www.vertical.lt/static/9085d84427d023cea69ba65505b5478a/ca599/cover01.png',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: SPORTS_ID,
            },
          ],
        },
        {
          title: 'Skybar',
          countryCode: 'LTU',
          lat: 54.694935,
          lng: 25.27493,
          geohash: geohash.encode(54.694935, 25.27493, 7),
          placeImages: [
            {
              title: 'Skybar',
              url:
                'https://www.govilnius.lt/api/images/5e26f62559c725a47cffc1fb?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: NIGHTLIFE_ID,
            },
          ],
        },
        {
          title: 'Mojito Nights',
          countryCode: 'LTU',
          lat: 54.682482,
          lng: 25.279929,
          geohash: geohash.encode(54.682482, 25.279929, 7),
          placeImages: [
            {
              title: 'Mojito Nights',
              url:
                'https://renginiai.kasvyksta.lt/uploads/places/341/mojito-klubas-vilnius-15.jpg',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: NIGHTLIFE_ID,
            },
          ],
        },
        {
          title: 'MO Museum',
          countryCode: 'LTU',
          lat: 54.679406,
          lng: 25.277483,
          geohash: geohash.encode(54.679406, 25.277483, 7),
          placeImages: [
            {
              title: 'MO Museum',
              url:
                'https://www.govilnius.lt/api/images/5e2699d54f5f290affc42869?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: MUSEUMS_ID,
            },
          ],
        },
        {
          title: 'Railway Museum',
          countryCode: 'LTU',
          lat: 54.67020007,
          lng: 25.28441995,
          geohash: geohash.encode(54.67020007, 25.28441995, 7),
          placeImages: [
            {
              title: 'Railway Museum',
              url:
                'https://www.govilnius.lt/api/images/5e7d479ca763b746cc5f96d6?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: MUSEUMS_ID,
            },
          ],
        },
        {
          title: 'Užupis',
          countryCode: 'LTU',
          lat: 54.68061,
          lng: 25.295037,
          geohash: geohash.encode(54.68061, 25.295037, 7),
          placeImages: [
            {
              title: 'Užupis',
              url:
                'https://www.govilnius.lt/api/images/5e20106736de745e237b428e?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: CULTURE_ID,
            },
          ],
        },
        {
          title: 'Pilies Street',
          countryCode: 'LTU',
          lat: 54.684571,
          lng: 25.28951,
          geohash: geohash.encode(54.684571, 25.28951, 7),
          placeImages: [
            {
              title: 'Pilies Street',
              url:
                'https://www.govilnius.lt/api/images/5e35e1b22ffce70d5fa5424a?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: CULTURE_ID,
            },
          ],
        },
        {
          title: 'The Love Arch',
          countryCode: 'LTU',
          lat: 54.67945,
          lng: 25.283375,
          geohash: geohash.encode(54.67945, 25.283375, 7),
          placeImages: [
            {
              title: 'The Love Arch',
              url:
                'https://www.govilnius.lt/api/images/5e4ae73b5f877b7e630c413d?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: HIDDEN_GEMS_ID,
            },
          ],
        },
        {
          title: 'Margutis Easter Egg',
          countryCode: 'LTU',
          lat: 54.675484,
          lng: 25.283051,
          geohash: geohash.encode(54.675484, 25.283051, 7),
          placeImages: [
            {
              title: 'Margutis Easter Egg',
              url:
                'https://assets.atlasobscura.com/media/W1siZiIsInVwbG9hZHMvcGxhY2VfaW1hZ2VzLzIyNjE1NTdhLTI0Y2EtNDljNC04N2UyLWM3MzUzZDBjMGU3ZGJiNjY0NGVhY2Y1NDY1NjMwM19JTUdfNDM5NS5qcGciXSxbInAiLCJ0aHVtYiIsIjEyMDB4PiJdLFsicCIsImNvbnZlcnQiLCItcXVhbGl0eSA4MSAtYXV0by1vcmllbnQiXV0/IMG_4395.jpg',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: HIDDEN_GEMS_ID,
            },
          ],
        },
        {
          title: 'Literature Street',
          countryCode: 'LTU',
          lat: 54.682193,
          lng: 25.290084,
          geohash: geohash.encode(54.682193, 25.290084, 7),
          placeImages: [
            {
              title: 'Literature Street',
              url:
                'https://www.govilnius.lt/api/images/5e1f0f2445d755303e819a95?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: HIDDEN_GEMS_ID,
            },
          ],
        },
        {
          title: 'Church of St. Anne',
          countryCode: 'LTU',
          lat: 54.683145,
          lng: 25.293192,
          geohash: geohash.encode(54.683145, 25.293192, 7),
          placeImages: [
            {
              title: 'Church of St. Anne',
              url:
                'https://www.govilnius.lt/api/images/5e260ccc4f5f2930e2c42467?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: ARCHITECTURE_ID,
            },
          ],
        },
        {
          title: 'Wooden Architecture',
          countryCode: 'LTU',
          lat: 54.68198,
          lng: 25.302896,
          geohash: geohash.encode(54.68198, 25.302896, 7),
          placeImages: [
            {
              title: 'Wooden Architecture',
              url:
                'https://www.govilnius.lt/api/images/5e4e95bcedbd3a566d08bb46?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: ARCHITECTURE_ID,
            },
          ],
        },
        {
          title: 'Hill of Three Crosses',
          countryCode: 'LTU',
          lat: 54.6866893,
          lng: 25.2975977,
          geohash: geohash.encode(54.6866893, 25.2975977, 7),
          placeImages: [
            {
              title: 'Hill of Three Crosses',
              url:
                'https://www.govilnius.lt/api/images/5e25fe054f5f290a18c42197?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: VIEWPOINTS_ID,
            },
          ],
        },
        {
          title: 'Subačius Panoramic Viewpoint',
          countryCode: 'LTU',
          lat: 54.677568,
          lng: 25.300205,
          geohash: geohash.encode(54.677568, 25.300205, 7),
          placeImages: [
            {
              title: 'Subačius Panoramic Viewpoint',
              url:
                'https://www.govilnius.lt/api/images/5df0dda6d7b884f322979fc1?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: VIEWPOINTS_ID,
            },
          ],
        },
        {
          title: 'Tauras Hill',
          countryCode: 'LTU',
          lat: 54.685730,
          lng: 25.269241,
          geohash: geohash.encode(54.685730, 25.269241, 7),
          placeImages: [
            {
              title: 'Tauras Hill',
              url:
                'https://www.govilnius.lt/api/images/5e25f6884f5f29194bc41ff8?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: VIEWPOINTS_ID,
            },
          ],
        },
      ],
      {
        include: [
          {
            model: PlaceImage,
            as: 'placeImages',
          },
          {
            model: PlaceTag,
            as: 'placeTags',
          },
        ],
      },
    );
  },

  down: (queryInterface, Sequelize) => {}
};
