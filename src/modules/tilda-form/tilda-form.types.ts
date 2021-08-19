export interface RenterRequestType {
  name: string;
  gender: GenderEnumType;
  birthdayYear: number;
  phone: string;
  moneyRange: MoneyRangeEnumType[];
  plannedArrivalDate: Date;
  location: LocationEnumType;
  subwayStations: SubwayStationEnumType[];
  university?: string;
  interests?: InterestEnumType[];
  preferences?: string;
  zodiacSign?: string;
  socials: string;
  telegram: string;
  utmSource: string;
  requestId: string;
  sentTime: Date;
}

export enum GenderEnumType {
  MALE = 'male',
  FEMALE = 'female',
}
export enum MoneyRangeEnumType {
  prelow = '15000-20000',
  low = '20000-25000',
  middle = '25000-30000',
  high = '30000-40000',
}
export enum LocationEnumType {
  firstRing = 'Внутри садового кольца',
  secondRing = 'Внутри ТТК',
  thirdRingSubwayClose = 'Внутри МКАД, близко к метро',
  thirdRing = 'Внутри МКАД, неважно сколько до метро',
  nevermind = 'Не имеет значения',
}
export enum SubwayStationEnumType {
  sokolnicheskaya = 'Сокольническая',
  zamoskvoretskaya = 'Замоскворецкая',
  arbatskoPokrovskaya = 'Арбатско-покровская',
  filevskaya = 'Филёвская',
  koltsevaya = 'Кольцевая',
  kaluzhskoRizhskaya = 'Калужско-Рижская',
  taganskoKransnopresnenskaya = 'Таганско-Краснопресненская',
  kalininskaya = 'Калининская',
  serpuhovskaya = 'Серпуховская',
  lublinskaya = 'Люблинская',
  kahovskaya = 'Каховская',
  butovskaya = 'Бутовская',
}
export enum InterestEnumType {
  clubs = 'Бары и клубы',
  sport = 'Спорт, йога',
  art = 'Литература, живопись',
  cinema = 'Кинематограф',
  music = 'Музыка',
  events = 'Техно вечеринки, фестивали',
  politics = 'Политика, финансы',
  fashion = 'Мода',
  cooking = 'Кулинария',
}
