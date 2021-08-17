export interface RenterRequestType {
  name: string;
  sex: 'Муж.' | 'Жен.';
  birthdayDate: number;
  phone: string;
  moneyRange: string;
  plannedArrivalDate: string;
  location: string;
  subwayStations: string;
  university: string;
  interests: string;
  interestsAdditionalArea: string;
  socials: string;
  telegram: string;
  zodiacSign: string;
  referrerLink: string;
  utmSource: string;
  requestId: string;
  sentTime: Date;
}
