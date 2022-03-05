import { Injectable } from '@nestjs/common';
import { LandlordObjectsControlService } from '../../../api/landlord-objects/landlord-objects.control.service';

@Injectable()
export class AdminApiService {
  constructor(private readonly landlordObjectsControlService: LandlordObjectsControlService) {}

  async approveObject(objectId: string, isApproved: boolean): Promise<void> {
    await this.landlordObjectsControlService.controlApprove({
      id: objectId,
      isApproved: isApproved,
    });
  }
}
