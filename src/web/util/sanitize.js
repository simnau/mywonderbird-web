export function sanitizeObject(object, fieldsToSanitize, initialValue = {}) {
  return fieldsToSanitize.reduce((acc, field) => {
    const fieldValue = object[field];

    if (!fieldValue && fieldValue !== 0) {
      return acc;
    }

    return {
      ...acc,
      [field]: fieldValue,
    };
  }, initialValue);
}
