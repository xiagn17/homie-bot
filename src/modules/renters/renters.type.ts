export interface TelegramUserType {
  chatId: string; // user's telegram id
}

export interface RenterType extends TelegramUserType {
  name: string;
  gender: GenderEnumType;
  birthdayYear: number;
  phone: string;
  moneyRange: MoneyRangeEnumType;
  plannedArrivalDate: Date;
  location: LocationEnumType;
  subwayStations: SubwayStationEnumType[];
  zodiacSign?: string;
  university?: string;
  interests?: InterestEnumType[];
  preferences?: string;
  socials: string;
  liveWithAnotherGender: WithAnotherGenderEnumType;
}

export interface RenterDraftType extends TelegramUserType {
  name: string;
  gender: GenderEnumType;
  birthdayYear: number;
  phone: string;
  moneyRange: MoneyRangeEnumType;
  plannedArrivalDate: string;
  location: LocationEnumType;
  subwayStations: string;
  zodiacSign?: string;
  university?: string;
  interests?: string;
  preferences?: string;
  socials: string;
  liveWithAnotherGender: WithAnotherGenderEnumType;
}

export enum GenderEnumType {
  MALE = 'male',
  FEMALE = 'female',
}

export enum WithAnotherGenderEnumType {
  yes = 'yes',
  not = 'not',
}

export enum MoneyRangeEnumType {
  prelow = '15000-20000',
  low = '20000-25000',
  middle = '25000-30000',
  high = '30000-40000',
}

export enum LocationEnumType {
  center = 'Центр (любая ветка)',
  north = 'Север',
  south = 'Юг',
  west = 'Запад',
  east = 'Восток',
  nevermind = 'Не имеет значения',
}

export enum SubwayStationEnumType {
  nevermind = 'Любая',
  red = 'Красная',
  green = 'Зеленая',
  blue = 'Синяя',
  lightBlue = 'Голубая',
  ring = 'Кольцевая',
  orange = 'Оранжевая',
  purple = 'Фиолетовая',
  yellow = 'Желтая',
  grey = 'Серая',
  lightGreen = 'Салатовая',
  lightPurple = 'Бирюзовая',
  greyBlue = 'Серо-голубая',
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
