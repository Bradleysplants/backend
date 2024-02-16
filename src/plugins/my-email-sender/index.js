// src/plugins/my-email-sender/index.js
const EmailSenderService = require("./email-sender-service");

module.exports = {
  register: (container, options) => {
    container.register({
      emailSenderService: asClass(EmailSenderService).singleton(),
    });
  },
  config: (currentConfig, userConfig) => {
    return {
      ...currentConfig,
      customConfig: { ...userConfig },
    };
  },
};
