const EmailSenderService = require("./emailSenderService");

module.exports = {
  register: (container, options) => {
    container.register({
      emailSenderService: asClass(EmailSenderService).singleton({
        injector: () => ({
          options: options, // Pass plugin options to your service
        }),
      }),
    });
  },
  config: (currentConfig, userConfig) => {
    // Optionally merge plugin-specific configuration
    return {
      ...currentConfig,
      myEmailSender: { ...userConfig },
    };
  },
};
