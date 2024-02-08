import { AwilixContainer } from "awilix";

export default async (container: AwilixContainer): Promise<void> => {
  const notificationService = container.resolve("notificationService");
  notificationService.subscribe("order.placed", EmailSenderService.identifier);
};
