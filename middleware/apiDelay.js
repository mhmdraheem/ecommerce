module.exports = (req, res, next) => {
  console.log(req.originalUrl, req.method);

  if (req.originalUrl.includes("/api/cart") && req.method === "DELETE") {
    setTimeout(() => {
      next();
    }, 2000);
  } else {
    next();
  }
};
