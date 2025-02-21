module.exports = (req, res, next) => {
  setTimeout(() => {
    next();
  }, 300);
};
