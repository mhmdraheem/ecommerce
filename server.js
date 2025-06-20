require("dotenv").config();
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const { redisClient, redisStore } = require("./config/redis");
const path = require("path");
const PORT = process.env.PORT || 3001;

const app = express();
app.enable("trust proxy");

// middleware
app.use(express.json());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        frameSrc: ["http://13.48.136.182"],
        scriptSrc: ["'self'", "*.fontawesome.com", "*.jsdelivr.net", "http://13.48.136.182"],
        styleSrc: [
          "'self'",
          "https://fonts.googleapis.com",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
          "http://13.48.136.182",
        ],
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com", "https://ka-f.fontawesome.com"],
        connectSrc: ["'self'", "https://ka-f.fontawesome.com"],
        imgSrc: ["'self'", "data:", "https://www.flaticon.com", "https://flagcdn.com", "*.vercel-storage.com"],
      },
    },
  })
);

app.use(
  session({
    name: "ecomm-session",
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(require("./middleware/sessionHandler"));

app.use(express.static(path.join(__dirname, "public/ecom")));

// API Routes
// app.use("/api", require("./middleware/apiDelay"));
// app.use("/api", require("./middleware/logger"));
app.use("/api/cart", require("./routes/cart"));
app.use("/api/product", require("./routes/product"));
app.use("/api/profile", require("./routes/profile"));

app.use("/api", require("./middleware/errorHandler"));

// Graceful Shutdown for Redis
process.on("SIGINT", () => {
  redisClient.quit().then(() => {
    console.log("Redis connection closed");
    process.exit(0);
  });
});

// Start Server (Only for Local Development)
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;
