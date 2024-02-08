import { AbstractNotificationService } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import AWS from 'aws-sdk';

class EmailSenderService extends AbstractNotificationService {
  protected manager_: EntityManager;
  protected transactionManager_: EntityManager;
  protected sesClient;

  constructor(container) {
    super(container);
    // Initialize AWS SES Client
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });
    this.sesClient = new AWS.SES({apiVersion: '2010-12-01'});
  }

  async sendNotification(event, data, attachmentGenerator) {
    if (event === "order.placed") {
      const order = await this.container.orderService.retrieve(data.id);
      const params = {
        Source: "your_verified_email@example.com",
        Destination: {
          ToAddresses: [order.email]
        },
        Message: {
          Subject: {
            Data: "You placed a new order!"
          },
          Body: {
            Text: {
              Data: "Your order details here..."
            }
          }
        }
      };

      try {
        const sendPromise = this.sesClient.sendEmail(params).promise();
        await sendPromise;
        console.log("Notification sent");
        return {
          to: order.email,
          status: "done",
          data: {
            subject: "You placed a new order!",
            items: order.items,
          },
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to send notification");
      }
    }
  }

  // Implement resendNotification similarly if needed
}

export default EmailSenderService;
