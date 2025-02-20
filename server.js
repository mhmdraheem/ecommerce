require("dotenv").config();
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const { redisClient, redisStore } = require("./config/redis");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
app.enable("trust proxy");

// middleware
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        frameSrc: ["https://vercel.live"],
        scriptSrc: [
          "'self'",
          "*.fontawesome.com",
          "*.jsdelivr.net",
          "https://vercel.live",
        ],
        styleSrc: [
          "'self'",
          "https://fonts.googleapis.com",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
        ],
        fontSrc: [
          "'self'",
          "data:",
          "https://fonts.gstatic.com",
          "https://ka-f.fontawesome.com",
        ],
        connectSrc: ["'self'", "https://ka-f.fontawesome.com"],
        imgSrc: [
          "'self'",
          "https://www.flaticon.com",
          "https://flagcdn.com",
          "*.vercel-storage.com",
        ],
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
      // domain: ".ecommerce-production-ca4f.up.railway.app",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "none",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.static(path.join(__dirname, "public")));

// Custom Session Middleware
app.use(require("./middleware/sessionHandler"));

// API Routes
app.use("/api", require("./middleware/apiDelay"));
app.use("/api", require("./middleware/logger"));
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
// if (process.env.NODE_ENV !== "production") {
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
// }

module.exports = app;
