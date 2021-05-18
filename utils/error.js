const error = (message, status) => {
  const err = new Error(message || "Something Went Wrong");
  err.status = status || 500;
  return err;
};
module.exports = error;
