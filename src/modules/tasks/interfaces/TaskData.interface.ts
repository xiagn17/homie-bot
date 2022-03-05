export type TaskDataInterface =
  | TaskDataLandlordRenewNotificationInterface
  | TaskDataAdminApproveObjectInterface
  | TaskDataNewObjectToRenterInterface;

export interface TaskDataLandlordRenewNotificationInterface {
  landlordObjectId: string;
}

export interface TaskDataAdminApproveObjectInterface {
  landlordObjectId: string;
  renterId: string;
}

export interface TaskDataNewObjectToRenterInterface {
  landlordObjectId: string;
  chatId: string;
}
