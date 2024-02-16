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

// Defining configuration directly within module.exports
module.exports = {
  projectConfig: {
    jwtSecret: process.env.JWT_SECRET,
    cookieSecret: process.env.COOKIE_SECRET,
    store_cors: process.env.STORE_CORS,
    database_url: process.env.DATABASE_URL,
    admin_cors: process.env.ADMIN_CORS,
    redisUrl: process.env.REDIS_URL,
  },
  plugins: [
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
        outDir: "build",
        develop: {
          port: 7001,
          logLevel: "verbose",
        },
      }, 
    }, 
    {
      resolve: `src/plugins/my-email-sender`,
      options: {
        awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
        awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        awsRegion: process.env.AWS_REGION,
        emailSource: "delisa@boujeebotanical.store", // Your verified sender email address
      },
    },
  ],
  modules: {
    eventBus: {
      resolve: "@medusajs/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    cacheService: {
      resolve: "@medusajs/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
  },
};
