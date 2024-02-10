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
  console.error("Failed to load the .env file", e);
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";

const REDIS_URL = process.env.REDIS_URL || "redis://default:jaJcjndJKh34BNbkeogoNPaifmGlDN1B@roundhouse.proxy.rlwy.net:27355";

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
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      serve: true,
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
        port: 7001,
      },
    },
  },
  {
     resolve: `medusa-payment-stripe`,
      options: {
        api_key: process.env.STRIPE_API_KEY,
        webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
      },
    },
  ];

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: "redis://default:jaJcjndJKh34BNbkeogoNPaifmGlDN1B@roundhouse.proxy.rlwy.net:27355",
    },
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: "redis://default:jaJcjndJKh34BNbkeogoNPaifmGlDN1B@roundhouse.proxy.rlwy.net:27355",
    },
  },
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: process.env.STORE_CORS,
  database_url: process.env.DATABASE_URL,
  admin_cors: process.env.ADMIN_CORS,
  redisUrl: process.env.REDIS_URL,
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
};
