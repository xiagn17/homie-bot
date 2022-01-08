export type CreateObjectRenterMatchesJobDataType =
  | CreateMatchesForObjectJobDataType
  | CreateMatchesForRenterJobDataType;

export interface CreateMatchesForObjectJobDataType {
  landlordObjectId: string;
}
export interface CreateMatchesForRenterJobDataType {
  renterId: string;
}
