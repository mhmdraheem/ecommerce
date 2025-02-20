require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { RedisStore } = require("connect-redis");
const { createClient } = require("redis");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

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

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "test-sess:",
  disableTTL: true,
});

app.set("trust proxy", true);
app.enable("trust proxy");

app.use(express.json());

app.use(
  session({
    name: "xxx",
    store: redisStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // domain: ".vercel.app",
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.static(path.join(__dirname, "public")));

// Graceful Shutdown for Redis
process.on("SIGINT", () => {
  redisClient.quit().then(() => {
    console.log("Redis connection closed");
    process.exit(0);
  });
});

app.listen("3000", () =>
  console.log(`Server running on http://localhost:3000`)
);

module.exports = app;
