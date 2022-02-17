import { Injectable } from '@nestjs/common';
import { RenterFiltersEntity } from '../entities/RenterFilters.entity';
import { ApiRenterFilters } from '../interfaces/renter-filters.interface';

@Injectable()
export class RenterFiltersSerializer {
  toResponse(renterFilters: RenterFiltersEntity): ApiRenterFilters {
    return {
      locations: renterFilters.locations,
      objectType: renterFilters.objectType,
      priceRangeEnd: renterFilters.priceRangeEnd,
      priceRangeStart: renterFilters.priceRangeStart,
      renterId: renterFilters.renterId,
    };
  }
}
