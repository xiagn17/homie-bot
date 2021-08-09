export interface RenterType {
  name: string;
  sex: 'Муж.' | 'Жен.';
  birthdayDate: string;
  age: number;
  phone: string;
  moneyRange: string;
  plannedArrival: string;
  location: string;
  subwayStations: string;
  university: string;
  interests: string;
}

export type SheetRenterType = [
  string,
  'Муж.' | 'Жен.',
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export interface FilteredRentersType {
  '18-29': InnerFilterByMoneyType;
  '30+': InnerFilterByMoneyType;
  by: string;
}

export interface InnerFilterByMoneyType {
  '15-20': InnerFilterByLocationType;
  '20-25': InnerFilterByLocationType;
  '25-30': InnerFilterByLocationType;
  '30-40': InnerFilterByLocationType;
  by: string;
}

export interface InnerFilterByLocationType {
  SadovoeRing: InnerFilterByArrivalType;
  Mkad: InnerFilterByArrivalType;
  TTK: InnerFilterByArrivalType;
  MkadCloseSubway: InnerFilterByArrivalType;
  Nevermind: InnerFilterByArrivalType;
  by: string;
}

export interface InnerFilterByArrivalType {
  now: RenterType[];
  inWeek: RenterType[];
  inCoupleWeeks: RenterType[];
  inMonthOrMore: RenterType[];
  by: string;
}

export type FlattedRentersType = Record<string, RenterType[]>;
