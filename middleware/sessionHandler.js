module.exports = async (req, res, next) => {
  let message = `Checking for session at ${req.url} => `;
  console.log(message);

  console.log("Request Cookies:", req.cookies);
  console.log("Session:", req.session);

  if (!req.session) {
    return res.status(500).json({ error: "Session is not initialized properly" });
  }

  try {
    // Ensure session is loaded from Redis
    if (!req.session.userId) {
      const sessionId = req.sessionID;
      console.log(sessionId);

      const existingSession = await req.sessionStore.get(sessionId);

      if (existingSession) {
        req.session = existingSession;
        message += `Loaded existing session ✅ ${req.session.userId}`;
      } else {
        // Create a new session only if it truly doesn't exist
        req.session.userId = `user-${Math.random().toString(36).substring(7)}`;
        req.session.cart = [];
        req.session.userData = {};
        message += `No session found, creating new one ✅ ${req.session.userId}`;
      }
    } else {
      message += `Session found: ${req.session.userId}`;
    }
  } catch (err) {
    console.error("Session retrieval error:", err);
  }

  console.log(message);
  next();
};
