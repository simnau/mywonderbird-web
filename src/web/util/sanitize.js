export function sanitizeObject(object, fieldsToSanitize, initialValue = {}) {
  return fieldsToSanitize.reduce((acc, field) => {
    const fieldValue = object[field];

    if (!fieldValue && fieldValue !== 0 && fieldValue !== false) {
      return acc;
    }

    return {
      ...acc,
      [field]: fieldValue,
    };
  }, initialValue);
}
