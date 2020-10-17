const { Tag } = require('../models/tag');

const BRUTALISM_ID = '9b75d07d-199e-4f3e-8223-b5517b3c8e22';
const HISTORICAL_SITES_ID = '0703fbfd-8b7d-4631-bd16-f1faf1fd1362';
const PHOTOGENIC_ID = '74128d5a-678f-4727-972f-4aac43ca4fc9';
const STREET_ART_ID = '6179e5e7-53aa-42f7-a222-d70e67b08f4a';
const MONUMENTS_ID = 'ec7fcd79-f09f-4bce-98c9-2e4d00486e4b';
const WOODEN_ARCHITECTURE_ID = '510822be-9788-4788-90cd-5215cf321b4f';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Tag.bulkCreate([{
      id: BRUTALISM_ID,
      title: 'Brutalism Architecture',
      code: 'brutalism',
      imageUrl: 'https://www.lrt.lt/img/2020/01/15/584617-985934-1287x836.jpg',
    }, {
      id: HISTORICAL_SITES_ID,
      title: 'Historical sites',
      code: 'historical',
      imageUrl: 'https://www.govilnius.lt/api/images/5ea6ae0e89426c805c4c2843?w=750&h=500&fit=contain',
    }, {
      id: PHOTOGENIC_ID,
      title: 'Photogenic places',
      code: 'photogenic',
      imageUrl: 'https://www.govilnius.lt/api/images/5e2c6f58984d896ed8080fc2?w=750&h=500&fit=contain',
    }, {
      id: STREET_ART_ID,
      title: 'Street Art',
      code: 'street-art',
      imageUrl: 'https://www.govilnius.lt/api/images/5e1f114136de740beb7b36a0?w=750&h=500&fit=contain',
    }, {
      id: MONUMENTS_ID,
      title: 'Monuments',
      code: 'monuments',
      imageUrl: 'https://www.govilnius.lt/api/images/5df4013baa15f8858d78985d?w=750&h=500&fit=contain',
    }, {
      id: WOODEN_ARCHITECTURE_ID,
      title: 'Wooden Architecture',
      code: 'wooden-architecture',
      imageUrl: 'https://www.govilnius.lt/api/images/5e1f146c36de743b657b3705?w=750&h=500&fit=contain',
    }]);
  },

  down: (queryInterface, Sequelize) => {
  }
};

module.exports.BRUTALISM_ID = BRUTALISM_ID;
module.exports.HISTORICAL_SITES_ID = HISTORICAL_SITES_ID;
module.exports.PHOTOGENIC_ID = PHOTOGENIC_ID;
module.exports.STREET_ART_ID = STREET_ART_ID;
module.exports.MONUMENTS_ID = MONUMENTS_ID;
module.exports.WOODEN_ARCHITECTURE_ID = WOODEN_ARCHITECTURE_ID;
