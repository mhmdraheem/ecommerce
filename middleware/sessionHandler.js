module.exports = async (req, res, next) => {
  if (!req.session) {
    return res
      .status(500)
      .json({ error: "Session is not initialized properly" });
  }

  try {
    if (!req.session.userId) {
      const sessionId = req.sessionID;
      const existingSession = await req.sessionStore.get(sessionId);

      if (existingSession) {
        req.session = existingSession;
      } else {
        req.session.userId = `user-${Math.random().toString(36).substring(7)}`;
        req.session.cart = [];
        req.session.userData = {};
        console.log(`Creating new session ✅ ${req.session.userId}`);
      }
    }
  } catch (err) {
    console.error("Session retrieval error:", err);
  }

  next();
};
