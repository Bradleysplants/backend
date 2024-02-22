const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production": //hello
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
      resolve: "medusa-plugin-ses",
      options: {
        access_key_id: process.env.SES_ACCESS_KEY_ID,
        secret_access_key: process.env.SES_SECRET_ACCESS_KEY,
        region: process.env.SES_REGION,
        from: process.env.SES_FROM,
        template_path: process.env.SES_TEMPLATE_PATH,
        partial_path: process.env.SES_PARTIAL_PATH,
        // optional string containing email address separated by comma
        order_placed_cc: 'person1@example.com,person2@example.com', 
        enable_endpoint: process.env.SES_ENABLE_ENDPOINT,
        enable_sim_mode: process.env.SES_ENABLE_SIM_MODE
      }
    },
    {
    resolve: `medusa-payment-paypal`,
    options: {
      sandbox: process.env.PAYPAL_SANDBOX,
      clientId: process.env.PAYPAL_CLIENT_ID,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET,
      authWebhookId: process.env.PAYPAL_AUTH_WEBHOOK_ID,
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
