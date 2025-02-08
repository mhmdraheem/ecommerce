const { RedisStore } = require("connect-redis");
const { createClient } = require("redis");

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

const redisStore = new RedisStore({ client: redisClient, prefix: "sess:", ttl: 0 });

module.exports = { redisClient, redisStore };
