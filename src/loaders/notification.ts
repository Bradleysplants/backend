import { AwilixContainer } from "awilix";
import EmailSenderService from "../service/email-sender";
export default async (container: AwilixContainer): Promise<void> => {
  const notificationService = container.resolve("notificationService");
  notificationService.subscribe("order.placed", EmailSenderService.identifier);
};
