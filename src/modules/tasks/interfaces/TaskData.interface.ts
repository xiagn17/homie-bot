export type TaskDataInterface =
  | TaskDataLandlordRenewNotificationInterface
  | TaskDataAdminObjectSubmitRenterInterface
  | TaskDataNewObjectToRenterInterface;

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
