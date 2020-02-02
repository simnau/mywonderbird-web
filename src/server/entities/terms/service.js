const {
  TERMS_OF_SERVICE_TYPE,
  PRIVACY_POLICY_TYPE,
} = require('../../constants/terms');
const { Terms } = require('../../orm/models/terms');

function findAll() {
  return Terms.findAll({
    order: [['createdAt', 'DESC']],
  });
}

async function findLatestByTypes() {
  const [termsOfService, privacyPolicy] = await Promise.all([
    Terms.findOne({
      where: {
        type: TERMS_OF_SERVICE_TYPE,
      },
      order: [['createdAt', 'DESC']],
    }),
    Terms.findOne({
      where: {
        type: PRIVACY_POLICY_TYPE,
      },
      order: [['createdAt', 'DESC']],
    }),
  ]);

  return {
    termsOfService,
    privacyPolicy,
  };
}

function create(terms) {
  return Terms.create(terms);
}

function deleteById(id) {
  return Terms.destroy({
    where: {
      id,
    },
  });
}

module.exports = {
  findAll,
  findLatestByTypes,
  create,
  deleteById,
};
