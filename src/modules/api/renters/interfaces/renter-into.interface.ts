import { RentersInfoLifestyleInterface } from './renters-info-lifestyle.interface';

export interface RenterIntoInterface {
  name: string;
  birthdayYear: number;
  phoneNumber: string;
  zodiacSign: string | null;
  socials: string;
  lifestyle: RentersInfoLifestyleInterface;
  profession: string;
  about: string;
  renterId: string;
}
