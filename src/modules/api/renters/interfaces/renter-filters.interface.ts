import { LocationsEnum, ObjectTypeEnum } from '../entities/RenterFilters.entity';

export interface ApiRenterFilters {
  objectType: ObjectTypeEnum[] | null;
  priceRangeStart: number | null;
  priceRangeEnd: number | null;
  locations: LocationsEnum[] | null;
  renterId: string;
}

export interface ApiRenterFiltersDraft extends Partial<ApiRenterFilters> {
  renterId: string;
}
