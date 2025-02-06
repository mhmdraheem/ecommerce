require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const { createClient } = require("redis");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Security Middleware
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

// Initialize Redis Client
const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
  },
});

redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.on("connect", () => console.log("Redis connected"));

(async () => {
  await redisClient.connect();
})();

// Configure Session with Redis Store
app.use(
  session({
    store: new RedisStore({ client: redisClient, prefix: "sess:" }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production", httpOnly: true, maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(express.static("public/html"));
app.use("/img", express.static(path.join(__dirname, "public/img")));

// Custom Middleware
app.use((req, res, next) => {
  if (!req.session) {
    console.error("❌ Session object is missing!");
    return res.status(500).json({ error: "Session is not initialized properly" });
  }

  if (!req.session.userId) {
    req.session.userId = `user-${Date.now()}`;
    req.session.cart = [];
    console.log("✅ New session created:", req.session.userId);
  } else {
    console.log("🔄 Existing session:", req.session.userId);
  }

  next();
});

// API Error Handling Middleware
app.use("/api", (err, req, res, next) => {
  try {
    next();
  } catch (error) {
    console.error("API Error:", err);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

// Routes
app.use("/api/cart", require("./routes/cart"));
app.use("/api/product", require("./routes/product"));

app.get("/", (req, res) => {
  console.log(req.session);
  res.sendFile(path.join(__dirname, "public/html/index.html"));
});

app.get("/:page", (req, res) => {
  const page = req.params.page.replace(/[^a-zA-Z0-9-]/g, "");
  const filePath = path.join(__dirname, "public/html", `${page}.html`);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).sendFile(path.join(__dirname, "public/html/404.html"));
  }
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
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
