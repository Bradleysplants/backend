const { AbstractNotificationService } = require("@medusajs/medusa");
const AWS = require('aws-sdk');

class EmailSenderService extends AbstractNotificationService {
  static identifier = "emailSenderService";

  constructor(container, options) {
    super(container);

    // Initialize AWS SES Client with options passed to the plugin
    this.sesClient = new AWS.SES({
      apiVersion: '2010-12-01',
      accessKeyId: options.awsAccessKeyId,
      secretAccessKey: options.awsSecretAccessKey,
      region: options.awsRegion
    });
  }

  async sendNotification(event, data) {
    // Example send logic tailored for "order.placed" event
    if (event === "order.placed" && data.email) {
      const params = {
        Source: options.emailSource, // Use the verified sender email address specified in plugin options
        Destination: { ToAddresses: [data.email] },
        Message: {
          Subject: { Data: "Order Confirmation" },
          Body: { Text: { Data: "Your order has been placed successfully." } }
        }
      };

      try {
        await this.sesClient.sendEmail(params).promise();
        console.log("Email sent successfully to", data.email);
        return { to: data.email, status: "success", data: {} };
      } catch (error) {
        console.error("Failed to send email via SES", error);
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(new Error("Event not handled or missing data"));
    }
  }

  async resendNotification(notification, config) {
    // Resend logic mirrors sendNotification with the possibility to adjust based on config
    // Assuming notification.data contains email and event previously used
    return this.sendNotification(notification.event, { email: notification.to });
  }
}

module.exports = EmailSenderService;
