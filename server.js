require("dotenv").config();
const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const { redisClient, redisStore } = require("./redis");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "*.fontawesome.com"],
        styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "https://ka-f.fontawesome.com"], // Allow FontAwesome fonts
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

app.use((req, res, next) => {
  if (!req.session) {
    return res.status(500).json({ error: "Session is not initialized properly" });
  }

  if (!req.session.userId) {
    req.session.userId = `user-${Date.now()}`;
    req.session.cart = [];
    console.log("✅ New session created:", req.session.userId);
  }

  next();
});

app.use("/api", (req, res, next) => {
  setTimeout(() => {
    next();
  }, 1);
});

app.use((req, res, next) => {
  try {
    if (!req.originalUrl.match(/^\/(style|img|script)/)) {
      console.log(
        `Recieved request" ${req.originalUrl}. ${req.method}, ${req.session.userId}, ${JSON.stringify(req.body)}`
      );
    }
  } catch (error) {
    console.error(error);
  } finally {
    next();
  }
});

app.use("/img", express.static(path.join(__dirname, "public/img")));
app.use("/", express.static("public"));

// Routes
app.use("/api/cart", require("./routes/cart"));
app.use("/api/product", require("./routes/product"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message || "Internal server error",
  });
});

// Graceful Shutdown
process.on("SIGINT", () => {
  redisClient.quit().then(() => {
    console.log("Redis connection closed");
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
