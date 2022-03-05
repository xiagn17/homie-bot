export interface LandlordObjectDetails {
  couples: boolean;
  animals: boolean;
  kids: boolean;
  fridge: boolean;
  washer: boolean;
  dishWasher: boolean;
  conditioner: boolean;
  internet: boolean;
}

export type LandlordObjectDetailsKeys = keyof LandlordObjectDetails;
