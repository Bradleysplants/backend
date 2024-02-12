const EmailSenderService = require("./path/to/email-sender");

module.exports = async (container) => {
  const notificationService = container.resolve("notificationService");
  notificationService.subscribe("order.placed", EmailSenderService.identifier);
};
