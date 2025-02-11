module.exports = (err, req, res, next) => {
  console.error("Error handler:", err.stack);
  res.status(500).json({
    error: err.message || "Internal server error",
  });
};
