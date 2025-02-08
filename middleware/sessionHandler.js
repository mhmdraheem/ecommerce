module.exports = (req, res, next) => {
  if (!req.session.userId) {
    if (!req.session.isNew) {
      console.log("🔄 Existing session:", req.session.userId);
    } else {
      req.session.userId = `user-${Math.random().toString(36).substring(7)}`;
      req.session.cart = [];
      console.log("✅ New session created:", req.session.userId);
    }
  }
  next();
};
