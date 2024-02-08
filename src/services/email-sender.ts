import { AbstractNotificationService } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import AWS from 'aws-sdk';

class EmailSenderService extends AbstractNotificationService {
  protected manager_: EntityManager;
  protected transactionManager_: EntityManager;

  static identifier = "email-sender";

  private sesClient: AWS.SES;

  constructor(container, options) {
    super(container);
    // Initialize AWS SES Client
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION // Ensure you've specified your AWS region here
    });
    this.sesClient = new AWS.SES({apiVersion: '2010-12-01'});
  }

  async sendNotification(
    event: string,
    data: any,
    attachmentGenerator?: any
  ): Promise<{
    to: string;
    status: string;
    data: Record<string, any>;
  }> {
    // Ensure data contains necessary email details
    if (event === "order.placed" && data.email) {
      const params = {
        Source: "Delisa.boujee-botanical.store", // Replace with your verified sender email address
        Destination: {
          ToAddresses: [
            data.email
          ]
        },
        Message: {
          Subject: {
            Data: "Order Confirmation"
          },
          Body: {
            Text: {
              Data: "Your order has been placed successfully."
            }
          }
        }
      };

      try {
        await this.sesClient.sendEmail(params).promise();
        console.log("Email sent to", data.email); // For logging purposes
        return {
          to: data.email,
          status: "success",
          data: {}, // You might want to return some data here
        };
      } catch (error) {
        console.error("Failed to send email via SES", error);
        return Promise.reject(error);
      }
    } else {
      return Promise.reject(new Error("Event not handled or missing data"));
    }
  }

  async resendNotification(
    notification: any,
    config?: any,
    attachmentGenerator?: any
  ): Promise<{
    to: string;
    status: string;
    data: Record<string, any>;
  }> {
    // Resend logic can mirror sendNotification or handle specific cases
    // For simplicity, this example will just call sendNotification again
    return this.sendNotification(notification.event, { email: notification.to }, attachmentGenerator);
  }
}

export default EmailSenderService;
