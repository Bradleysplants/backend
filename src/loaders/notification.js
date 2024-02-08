import MedusaContainer from "@medusajs/medusa/dist/types/global";
import NotificationService from "@medusajs/medusa/dist/services/notification";

export default async (container: MedusaContainer) => {
  const notificationService = container.resolve<NotificationService>("notificationService");
  notificationService.subscribe("order.placed", "email-sender");
};
