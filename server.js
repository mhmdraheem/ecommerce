require("dotenv").config();
const express = require("express");
const session = require("express-session");
const helmet = require("helmet");
const { redisClient, redisStore } = require("./config/redis");
const path = require("path");
const PORT = process.env.PORT || 3002;

const app = express();
app.enable("trust proxy");

// middleware
app.use(express.json());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "*.fontawesome.com", "*.jsdelivr.net"],
        styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com", "https://ka-f.fontawesome.com"],
        connectSrc: ["'self'", "https://ka-f.fontawesome.com"],
        imgSrc: ["'self'", "data:", "https://www.flaticon.com", "https://flagcdn.com"],
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

app.use("/", express.static(path.join(__dirname, "public/ecom")));
app.use("/ecom", express.static(path.join(__dirname, "public/ecom")));

// API Routes
// app.use("/api", require("./middleware/apiDelay"));
// app.use("/api", require("./middleware/logger"));
app.use("/ecom/api/cart", require("./routes/cart"));
app.use("/ecom/api/product", require("./routes/product"));
app.use("/ecom/api/profile", require("./routes/profile"));

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
