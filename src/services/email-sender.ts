import { AbstractNotificationService, OrderService } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import AWS from 'aws-sdk';

class EmailSenderService extends AbstractNotificationService {
  protected manager_: EntityManager;
  protected transactionManager_: EntityManager;
  protected sesClient: AWS.SES;

  constructor(container: any) {
    super(container);
    // Initialize AWS SES Client
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });
    this.sesClient = new AWS.SES({apiVersion: '2010-12-01'});
  }

  async sendNotification(event: string, data: any, attachmentGenerator?: any): Promise<{
    to: string;
    status: string;
    data: Record<string, any>;
  }> {
    if (event === "order.placed") {
      // Using type assertion for orderService
      const orderService = this.container.resolve("orderService") as OrderService;
      const order = await orderService.retrieve(data.id);
      const params = {
        Source: "delisa.boujee-botanical.store",
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
        await this.sesClient.sendEmail(params).promise();
        console.log("Notification sent");
        return {
          to: order.email,
          status: "done",
          data: {
            subject: "You placed a new order!",
            items: order.items.map(item => item.title), // Assuming items have a title property
          },
        };
      } catch (error) {
        console.error(error);
        return Promise.reject(new Error("Failed to send notification"));
      }
    }
    // Placeholder return for non-handled events
    return Promise.reject(new Error("Event not handled"));
  }

  async resendNotification(notification: any, config?: any, attachmentGenerator?: any): Promise<{
    to: string;
    status: string;
    data: Record<string, any>;
  }> {
    // Placeholder implementation for resendNotification
    console.log("Resend notification not implemented.");
    return Promise.reject(new Error("resendNotification method not implemented."));
  }
}

export default EmailSenderService;
