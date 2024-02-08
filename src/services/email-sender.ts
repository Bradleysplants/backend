import { AbstractNotificationService } from "@medusajs/medusa";
import { EntityManager } from "typeorm";

class EmailSenderService extends AbstractNotificationService {
  protected manager_: EntityManager;
  protected transactionManager_: EntityManager;

  static identifier = "email-sender"; // Unique identifier for the notification provider

  constructor(container, options) {
    super(container);
    // Initialize third-party client or other Medusa services here
  }

  async sendNotification(
    event: string,
    data: any, // Adjust the type as necessary
    attachmentGenerator?: any // Adjust the type as necessary
  ): Promise<{
    to: string;
    status: string;
    data: Record<string, any>; // Adjust the type as necessary
  }> {
    // Implementation for sending notification
    throw new Error("Method not implemented.");
  }

  async resendNotification(
    notification: any, // Adjust the type as necessary
    config?: any, // Adjust the type as necessary
    attachmentGenerator?: any // Adjust the type as necessary
  ): Promise<{
    to: string;
    status: string;
    data: Record<string, any>; // Adjust the type as necessary
  }> {
    // Implementation for resending notification
    throw new Error("Method not implemented.");
  }
}

export default EmailSenderService;
