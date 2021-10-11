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

function groupBy(array, key) {
  if (!array) {
    return {};
  }

  return array.reduce((result, item) => {
    const resolvedKey = typeof key === 'function' ? key(item) : key;
    const items = [...(result[resolvedKey] || []), item];

    return {
      ...result,
      [resolvedKey]: items,
    };
  }, {});
}

function flatMap(array, mapFunction) {
  if (!array) {
    return [];
  }

  return array
    .map(mapFunction)
    .reduce((result, items) => result.concat(items), []);
}

module.exports = {
  unique,
  indexBy,
  groupBy,
  flatMap,
};
