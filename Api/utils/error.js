// utils/error.js
exports.errorHandler = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};
