require("dotenv").config();
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const { redisClient, redisStore } = require("./config/redis");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "*.fontawesome.com", "*.jsdelivr.net"],
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
    cookie: { secure: process.env.NODE_ENV === "production", httpOnly: true },
  })
);

// Custom Session Middleware
app.use(require("./middleware/sessionHandler"));

// API Routes
app.use("/api", require("./middleware/apiDelay"));
app.use("/api", require("./middleware/logger"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/product", require("./routes/product"));
app.use("/api", require("./middleware/errorHandler"));

app.use(express.static(path.join(__dirname, "public")));

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

module.exports = app;
