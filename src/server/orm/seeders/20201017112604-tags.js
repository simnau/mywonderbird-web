const { Tag } = require('../models/tag');

const FOOD_ID = '9b75d07d-199e-4f3e-8223-b5517b3c8e22';
const CULTURE_ID = '0703fbfd-8b7d-4631-bd16-f1faf1fd1362';
const SPORTS_ID = '74128d5a-678f-4727-972f-4aac43ca4fc9';
const NIGHTLIFE_ID = '6179e5e7-53aa-42f7-a222-d70e67b08f4a';
const HIDDEN_GEMS_ID = 'ec7fcd79-f09f-4bce-98c9-2e4d00486e4b';
const MUSEUMS_ID = '510822be-9788-4788-90cd-5215cf321b4f';
const ARCHITECTURE_ID = '47fb742c-be43-456c-b11e-fb410a8df120';
const VIEWPOINTS_ID = 'd8ead6ae-1bd5-43f3-85e2-ae3eb5bf0997';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Tag.bulkCreate([{
      id: FOOD_ID,
      title: 'Food',
      code: 'food',
      imageUrl: 'https://i.guim.co.uk/img/media/d8680e08583b34a56a91c02f2c888db6bcfb9947/0_168_4184_2510/master/4184.jpg?width=700&quality=85&auto=format&fit=max&s=0f838d4aedc26c10c4ce06d1a7666e61',
    }, {
      id: CULTURE_ID,
      title: 'Culture',
      code: 'culture',
      imageUrl: 'https://www.govilnius.lt/api/images/5e20106736de745e237b428e?w=750&h=500&fit=contain',
    }, {
      id: SPORTS_ID,
      title: 'Sports',
      code: 'sports',
      imageUrl: 'https://thumbor.forbes.com/thumbor/fit-in/1200x0/filters%3Aformat%28jpg%29/https%3A%2F%2Fspecials-images.forbesimg.com%2Fimageserve%2F1223681394%2F0x0.jpg',
    }, {
      id: NIGHTLIFE_ID,
      title: 'Nightlife',
      code: 'nightlife',
      imageUrl: 'https://www.govilnius.lt/api/images/5e26f62559c725a47cffc1fb?w=750&h=500&fit=contain',
    }, {
      id: HIDDEN_GEMS_ID,
      title: 'Hidden Gems',
      code: 'hidden-gems',
      imageUrl: 'https://www.govilnius.lt/api/images/5e4ae73b5f877b7e630c413d?w=750&h=500&fit=contain',
    }, {
      id: MUSEUMS_ID,
      title: 'Museums',
      code: 'museums',
      imageUrl: 'https://www.govilnius.lt/api/images/5e2699d54f5f290affc42869?w=750&h=500&fit=contain',
    }, {
      id: ARCHITECTURE_ID,
      title: 'Architecture',
      code: 'architecture',
      imageUrl: 'https://www.govilnius.lt/api/images/5e260ccc4f5f2930e2c42467?w=750&h=500&fit=contain',
    }, {
      id: VIEWPOINTS_ID,
      title: 'Viewpoints',
      code: 'viewpoints',
      imageUrl: 'https://www.govilnius.lt/api/images/5e25fe054f5f290a18c42197?w=750&h=500&fit=contain',
    }]);
  },

  down: (queryInterface, Sequelize) => {
  }
};

module.exports.FOOD_ID = FOOD_ID;
module.exports.CULTURE_ID = CULTURE_ID;
module.exports.SPORTS_ID = SPORTS_ID;
module.exports.NIGHTLIFE_ID = NIGHTLIFE_ID;
module.exports.HIDDEN_GEMS_ID = HIDDEN_GEMS_ID;
module.exports.MUSEUMS_ID = MUSEUMS_ID;
module.exports.ARCHITECTURE_ID = ARCHITECTURE_ID;
module.exports.VIEWPOINTS_ID = VIEWPOINTS_ID;
