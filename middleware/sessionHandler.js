module.exports = (req, res, next) => {
  let message = `Checking for session at ${req.url} => `;

  if (!req.session) {
    return res.status(500).json({ error: "Session is not initialized properly" });
  }

  if (!req.session.userId) {
    req.session.userId = `user-${Math.random().toString(36).substring(7)}`;
    req.session.cart = [];
    req.session.userData = {};
    message += `No session found, creating new one ✅ ${req.session.userId}`;
  } else {
    message += `Session found: ${req.session.userId}`;
  }

  next();
};
