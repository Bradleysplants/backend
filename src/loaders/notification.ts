import { AwilixContainer } from "awilix";
import EmailSenderService from "../../services/email-sender";

export default async (container: AwilixContainer): Promise<void> => {
  const notificationService = container.resolve("notificationService");
  notificationService.subscribe("order.placed", EmailSenderService.identifier);
};
