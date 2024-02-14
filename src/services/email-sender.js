const { AbstractNotificationService } = require("@medusajs/medusa");
const AWS = require('aws-sdk');

class EmailSenderService extends AbstractNotificationService {
  static identifier = "emailSenderService";
  
  constructor(container) {
    super(container);

    // Initialize AWS SES Client with environment variables
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION // Ensure your AWS region is specified here
    });
    this.sesClient = new AWS.SES({apiVersion: '2010-12-01'});
  }

  async sendNotification(event, data) {
    // Example send logic tailored for "order.placed" event
    if (event === "order.placed" && data.email) {
      const params = {
        Source: "your-email@example.com", // Replace with your verified sender email address in Amazon SES
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
