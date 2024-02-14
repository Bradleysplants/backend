const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {
  console.error("Failed to load the .env file", e);
}

// CORS when consuming Medusa from admin
const ADMIN_CORS = process.env.ADMIN_CORS;

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS;

const DATABASE_URL = process.env.DATABASE_URL;

const REDIS_URL = process.env.REDIS_URL;

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: "uploads",
    },
  },
  {
    resolve: "@medusajs/admin",
    options: {
      serve: true,
      autoRebuild: true,
      path: "/app",
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
];

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL, // Using the variable defined above
    },
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL, // Using the variable defined above
    },
  },
};

const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS, // Using the variable defined above
  database_url: DATABASE_URL, // Using the variable defined above
  admin_cors: ADMIN_CORS, // Using the variable defined above
  redisUrl: REDIS_URL, // Using the variable defined above
};

module.exports = {
  projectConfig,
  plugins,
  modules,
};
