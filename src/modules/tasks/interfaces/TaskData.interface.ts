export type TaskDataInterface =
  | TaskDataLandlordRenewNotificationInterface
  | TaskDataAdminObjectSubmitRenterInterface
  | TaskDataNewObjectToRenterInterface
  | TaskDataSendMessageInterface;

export interface TaskDataLandlordRenewNotificationInterface {
  landlordObjectId: string;
}

export interface TaskDataAdminObjectSubmitRenterInterface {
  landlordObjectId: string;
  renterId: string;
}

export interface TaskDataNewObjectToRenterInterface {
  landlordObjectId: string;
  chatId: string;
}

export interface TaskDataSendMessageInterface {
  message: string;
  chatId: string;
  markup?: string;
}
