module.exports = (req, res, next) => {
  const body = JSON.stringify(req.body);
  console.log(`${req.method} ${req.originalUrl} ${body}`);
  next();
};
