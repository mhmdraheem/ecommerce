require("dotenv").config();
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const { redisClient, redisStore } = require("./config/redis");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "*.fontawesome.com"],
        styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://ka-f.fontawesome.com"],
        connectSrc: ["'self'", "https://ka-f.fontawesome.com"],
      },
    },
  })
);
app.use(
  session({
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production", httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 },
  })
);

// Custom Session Middleware
app.use(require("./middleware/sessionHandler"));

// API Routes
app.use("/api/cart", require("./routes/cart"));
app.use("/api/product", require("./routes/product"));

// Serve Static Files
app.use(express.static("public"));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message || "Internal server error",
  });
});

// Graceful Shutdown for Redis
process.on("SIGINT", () => {
  redisClient.quit().then(() => {
    console.log("Redis connection closed");
    process.exit(0);
  });
});

// Start Server (Only for Local Development)
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

// Export for Vercel Deployment
module.exports = app;
