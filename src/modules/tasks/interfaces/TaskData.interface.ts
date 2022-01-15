export type TaskDataInterface =
  | TaskDataLandlordRenewNotificationInterface
  | TaskDataAdminApproveObjectInterface;

export interface TaskDataLandlordRenewNotificationInterface {
  landlordObjectId: string;
}

export interface TaskDataAdminApproveObjectInterface {
  landlordObjectId: string;
  renterId: string;
}
