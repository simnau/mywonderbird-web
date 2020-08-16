function unique(array) {
  return [...new Set(array)];
}

function indexBy(array, key) {
  if (!array) {
    return {};
  }

  return array.reduce((result, item) => {
    return {
      ...result,
      [item[key]]: item,
    };
  }, {});
}

module.exports = {
  unique,
  indexBy,
};
