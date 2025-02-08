module.exports = (req, res, next) => {
  if (!req.session) {
    return res.status(500).json({ error: "Session is not initialized properly" });
  }

  if (!req.session.userId) {
    req.session.userId = `user-${Math.random().toString(36).substring(7)}`;
    req.session.cart = [];
    console.log("✅ New session created:", req.session.userId);
  }
  next();
};
