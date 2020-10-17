const { Place } = require('../models/place');
const { PlaceImage } = require('../models/place-image');
const { PlaceTag } = require('../models/place-tag');
const geohash = require('ngeohash');

const {
  BRUTALISM_ID: BRUTALISM_ID,
  HISTORICAL_SITES_ID: HISTORICAL_SITES_ID,
  PHOTOGENIC_ID: PHOTOGENIC_ID,
  STREET_ART_ID: STREET_ART_ID,
  MONUMENTS_ID: MONUMENTS_ID,
  WOODEN_ARCHITECTURE_ID: WOODEN_ARCHITECTURE_ID,
} = require('./20201017112604-tags');

const SPORTS_PALACE_ID = 'be4931bd-eeec-446c-8be0-88ec6a5d7b12';
const ART_GALLERY_ID = '12687c30-dc73-4292-8c42-de8a4b9d9bab';
const ADMINISTRATIVE_ID = 'f0d899ed-6921-4a6b-934e-9148b423e0f6';
const MARRIAGE_CHAMBER_ID = 'f6f36f23-905d-4869-8206-6501267f19dd';
const MARKUCIAI_ID = 'e360b6a8-f954-4422-9c45-cf36dd0688a8';
const MEMORIAL_MUSEUM_ID = 'fef99bc7-8cbd-4cc4-8025-c2005c51555f';
const RAILWAY_ID = 'fd38835b-7bf4-4bc3-9f88-83a35eaaa2b7';
const MICKEVICIUS_ID = '72527371-2195-48b6-b87e-cfb03ebe59dd';
const SWEDBANK_ID = '2d773898-c51c-45d9-9602-c7c6f0413d84';
const ALTANA_HILL_ID = 'c9a90694-4872-45cf-a612-199a4b57060f';
const SKYBAR_ID = '89ee06ad-5add-41fc-9fdc-fa85d8566f54';
const LIEPKALNIS_ID = '68861744-8c21-4ad6-844d-f1629d8845ec';
const GAONO_ART_ID = 'b34123b9-c13c-4a93-875b-9c8ef412276a';
const PYLIMO_ID = 'd1ae0e04-b892-4fd9-9d28-b0def091fa5e';
const FRIDA_ID = '438937b3-4ac5-45b0-8783-26ab4c008d9a';
const KRAZIU_ID = '0922b1a2-4b84-47d2-99c0-476252d9ebed';
const LUCKY_BELLY_ID = '38346604-d512-477a-81f2-1776a38f29b4';
const HOUNDS_ID = '5f90e4f8-9c83-4d7c-bc4a-73651f7b179c';
const CAT_ID = '33543fe6-0eaf-44d6-9be8-4f6b3a27e094';
const ROMAIN_GARY_ID = 'ec0b7827-ee7f-4072-9953-4afeea19abae';
const ZVERYNAS_ID = '507dcfc0-0443-44ad-8896-2217dd31b526';
const SNIPISKES_ID = 'b2c7764f-7fec-47ad-b98d-e120b3ade2ad';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Place.bulkCreate(
      [
        {
          id: SPORTS_PALACE_ID,
          title: 'Palace of Concerts and Sports',
          countryCode: 'LTU',
          lat: 54.691109,
          lng: 25.290879,
          geohash: geohash.encode(54.691109, 25.290879, 9),
          placeImages: [
            {
              title: 'Palace of Concerts and Sports',
              url:
                'https://lithuania-grlk5lagedl.stackpathdns.com/production/lithuania/images/1542811075782385-06.jpg?w=1920&h=800&fit=fillmax&crop=focalpoint&auto=%5B%22format%22%2C%20%22compress%22%5D&cs=srgb',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: BRUTALISM_ID,
            },
          ],
        },
        {
          id: ART_GALLERY_ID,
          title: 'National Gallery of Art',
          countryCode: 'LTU',
          lat: 54.696768,
          lng: 25.271189,
          geohash: geohash.encode(54.696768, 25.271189, 9),
          placeImages: [
            {
              title: 'National Gallery of Art',
              url:
                'http://archiforma.lt/wp-content/uploads/2014/10/Nacionaline_dailes_galerija.jpg',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: BRUTALISM_ID,
            },
          ],
        },
        {
          id: ADMINISTRATIVE_ID,
          title: 'Administrative Building',
          countryCode: 'LTU',
          lat: 54.687774,
          lng: 25.272134,
          geohash: geohash.encode(54.687774, 25.272134, 9),
          placeImages: [
            {
              title: 'Administrative Building',
              url:
                'https://s2.15min.lt/images/photos/2017/04/12/original/lietuvos-kooperatyvu-sajungos-administracinis-pastatas-58edf7c253716.jpg',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: BRUTALISM_ID,
            },
          ],
        },
        {
          id: MARRIAGE_CHAMBER_ID,
          title: 'Marriage Chamber',
          countryCode: 'LTU',
          lat: 54.683037,
          lng: 25.269227,
          geohash: geohash.encode(54.683037, 25.269227, 9),
          placeImages: [
            {
              title: 'Marriage Chamber',
              url:
                'https://s1.15min.lt/images/photos/2015/07/28/original/santuoku-rumai-55b778905ba01.jpg',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: BRUTALISM_ID,
            },
          ],
        },
        {
          id: MARKUCIAI_ID,
          title: 'Markučiai Manor',
          countryCode: 'LTU',
          lat: 54.673888,
          lng: 25.325585,
          geohash: geohash.encode(54.673888, 25.325585, 9),
          placeImages: [
            {
              title: 'Markučiai Manor',
              url:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Alexander_Pushkin_Museum_in_Vilnius2.JPG/1200px-Alexander_Pushkin_Museum_in_Vilnius2.JPG',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: HISTORICAL_SITES_ID,
            },
          ],
        },
        {
          id: MEMORIAL_MUSEUM_ID,
          title: 'Vincas Mykolaitis-Putinas Memorial Museum',
          countryCode: 'LTU',
          lat: 54.679406,
          lng: 25.277483,
          geohash: geohash.encode(54.679406, 25.277483, 9),
          placeImages: [
            {
              title: 'Vincas Mykolaitis-Putinas Memorial Museum',
              url: 'https://www.panoramas.lt/files/4b790798958ade05ac7f',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: HISTORICAL_SITES_ID,
            },
          ],
        },
        {
          id: RAILWAY_ID,
          title: 'Verkiai Manor',
          countryCode: 'LTU',
          lat: 54.748079,
          lng: 25.292863,
          geohash: geohash.encode(54.748079, 25.292863, 9),
          placeImages: [
            {
              title: 'Verkiai Manor',
              url:
                'https://lh3.googleusercontent.com/proxy/7F2JmTPLxHZRd7E2wddnHRU3sCe1FR0lcK3EUS8-dgXfdpWOL8bhhxEkJjreEQr9mYrDpjh7QVQ-C9fKeRL9rZ2eSwb6JrcKBXQxo5dqLwbezz4qQaWKX4NdpxzNl14nHjDKUwGo2x3u',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: HISTORICAL_SITES_ID,
            },
          ],
        },
        {
          id: MICKEVICIUS_ID,
          title: 'Mickevicius Courtyard',
          countryCode: 'LTU',
          lat: 54.683381,
          lng: 25.289069,
          geohash: geohash.encode(54.683381, 25.289069, 9),
          placeImages: [
            {
              title: 'Mickevicius Courtyard',
              url:
                'https://lh3.googleusercontent.com/proxy/Yu6x69x1nNVIx34xUU_2FIQym_k_kmTWcgs3ccrMk6Gp9UaYpRlIxKNQA-qGeJiRTIOu30Rx2U_9Vnz_JUjDHEYVHMblEeSMwdanZcuYsxDuYtpbo4LcwvenQPqDGXU',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: HISTORICAL_SITES_ID,
            },
          ],
        },
        {
          id: SWEDBANK_ID,
          title: 'Swedbank Terrace',
          countryCode: 'LTU',
          lat: 54.696132,
          lng: 25.273243,
          geohash: geohash.encode(54.696132, 25.273243, 9),
          placeImages: [
            {
              title: 'Swedbank Terrace',
              url: 'https://www.efoto.lt/files/images/35058/IMG_5170_HDR.jpg',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: PHOTOGENIC_ID,
            },
          ],
        },
        {
          id: ALTANA_HILL_ID,
          title: 'Altana Hill',
          countryCode: 'LTU',
          lat: 54.683787,
          lng: 25.300599,
          geohash: geohash.encode(54.683787, 25.300599, 9),
          placeImages: [
            {
              title: 'Altana Hill',
              url:
                'https://www.govilnius.lt/api/images/5e4e8e8bedbd3a3ef408ba68?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: PHOTOGENIC_ID,
            },
          ],
        },
        {
          id: SKYBAR_ID,
          title: 'Skybar',
          countryCode: 'LTU',
          lat: 54.694902,
          lng: 25.274918,
          geohash: geohash.encode(54.694902, 25.274918, 9),
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
              tagId: PHOTOGENIC_ID,
            },
          ],
        },
        {
          id: LIEPKALNIS_ID,
          title: 'Liepkalnis',
          countryCode: 'LTU',
          lat: 54.655513,
          lng: 25.306784,
          geohash: geohash.encode(54.655513, 25.306784, 9),
          placeImages: [
            {
              title: 'Liepkalnis',
              url:
                'https://www.govilnius.lt/api/images/5e65fb2ad34eaa69d4d9c164?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: PHOTOGENIC_ID,
            },
          ],
        },
        {
          id: GAONO_ART_ID,
          title: 'Gaono street art',
          countryCode: 'LTU',
          lat: 54.680786,
          lng: 25.286644,
          geohash: geohash.encode(54.680786, 25.286644, 9),
          placeImages: [
            {
              title: 'Gaono street art',
              url:
                'https://i2.wp.com/www.golivegotravel.nl/wp-content/uploads/2020/03/Street-art-wall-that-remember-vilnius.jpg?resize=1024%2C683&ssl=1',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: STREET_ART_ID,
            },
          ],
        },
        {
          id: PYLIMO_ID,
          title: 'Pylimo street art',
          countryCode: 'LTU',
          lat: 54.674232,
          lng: 25.285578,
          geohash: geohash.encode(54.674232, 25.285578, 9),
          placeImages: [
            {
              title: 'Pylimo street art',
              url:
                'https://i1.wp.com/www.golivegotravel.nl/wp-content/uploads/2020/03/Millo-street-art-Vilnius.jpg?resize=1024%2C683&ssl=1',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: STREET_ART_ID,
            },
          ],
        },
        {
          id: FRIDA_ID,
          title: 'Frida street art',
          countryCode: 'LTU',
          lat: 54.68868,
          lng: 25.274584,
          geohash: geohash.encode(54.68868, 25.274584, 9),
          placeImages: [
            {
              title: 'Frida street art',
              url:
                'https://i0.wp.com/www.golivegotravel.nl/wp-content/uploads/2020/03/Street-art-Frida-Vilnius.jpg?resize=1024%2C683&ssl=1',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: STREET_ART_ID,
            },
          ],
        },
        {
          id: KRAZIU_ID,
          title: 'Kražių street art',
          countryCode: 'LTU',
          lat: 54.690688,
          lng: 25.266675,
          geohash: geohash.encode(54.690688, 25.266675, 9),
          placeImages: [
            {
              title: 'Kražių street art',
              url:
                'https://i2.wp.com/www.golivegotravel.nl/wp-content/uploads/2020/03/Street-art-prison-Vilnius.jpg?resize=1024%2C683&ssl=1',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: STREET_ART_ID,
            },
          ],
        },
        {
          id: LUCKY_BELLY_ID,
          title: 'Lucky Belly',
          countryCode: 'LTU',
          lat: 54.686512,
          lng: 25.279579,
          geohash: geohash.encode(54.686512, 25.279579, 9),
          placeImages: [
            {
              title: 'Lucky Belly',
              url:
                'https://www.govilnius.lt/api/images/5df0a10fdde5a684f1b26eb9?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: MONUMENTS_ID,
            },
          ],
        },
        {
          id: HOUNDS_ID,
          title: 'Lithuanian Hounds',
          countryCode: 'LTU',
          lat: 54.68573,
          lng: 25.269241,
          geohash: geohash.encode(54.68573, 25.269241, 9),
          placeImages: [
            {
              title: 'Lithuanian Hounds',
              url:
                'https://www.govilnius.lt/api/images/5df40816aa15f80f5a7898aa?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: MONUMENTS_ID,
            },
          ],
        },
        {
          id: CAT_ID,
          title: 'Užupis Cat',
          countryCode: 'LTU',
          lat: 54.681323,
          lng: 25.300236,
          geohash: geohash.encode(54.681323, 25.300236, 9),
          placeImages: [
            {
              title: 'Užupis Cat',
              url:
                'https://www.govilnius.lt/api/images/5df4013baa15f8858d78985d?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: MONUMENTS_ID,
            },
          ],
        },
        {
          id: ROMAIN_GARY_ID,
          title: 'Romain Gary',
          countryCode: 'LTU',
          lat: 54.680595,
          lng: 25.272965,
          geohash: geohash.encode(54.680595, 25.272965, 9),
          placeImages: [
            {
              title: 'Romain Gary',
              url:
                'https://www.govilnius.lt/api/images/5dee4d9f1a188921bb42309c?w=750&h=500&fit=contain',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: MONUMENTS_ID,
            },
          ],
        },
        {
          id: ZVERYNAS_ID,
          title: 'Žvėrynas',
          countryCode: 'LTU',
          lat: 54.692834,
          lng: 25.245714,
          geohash: geohash.encode(54.692834, 25.245714, 9),
          placeImages: [
            {
              title: 'Žvėrynas',
              url:
                'https://www.lithuania.travel/media/cache/widen_2000/uploads/mediaparkcms/article/6a3878db9f35979e4a625fe52c878394ca3a59e6.jpeg',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: WOODEN_ARCHITECTURE_ID,
            },
          ],
        },
        {
          id: SNIPISKES_ID,
          title: 'Romain Gary',
          countryCode: 'LTU',
          lat: 54.698592,
          lng: 25.278642,
          geohash: geohash.encode(54.698592, 25.278642, 9),
          placeImages: [
            {
              title: 'Romain Gary',
              url:
                'http://www.truelithuania.com/Nuotraukos/VilniusSnipiskes.JPG',
              userId: '1f56cf3b-73c8-4219-9928-fca2f41ec05e',
            },
          ],
          placeTags: [
            {
              tagId: WOODEN_ARCHITECTURE_ID,
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

  down: (queryInterface, Sequelize) => {},
};
