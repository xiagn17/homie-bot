import { Injectable } from '@nestjs/common';
import { LandlordObjectsService } from '../landlord-objects/landlord-objects.service';
import { getDefaultObjectText } from '../../bot/renter-objects/texts/helpers/object-preview.helpers';

@Injectable()
export class AdminService {
  constructor(private landlordObjectsService: LandlordObjectsService) {}

  async getObjectsHtml(validate: string): Promise<string> {
    const VALIDATE_STRING = 'jidashiyudhj8y273gyubdhwushgyib28376f';
    if (validate !== VALIDATE_STRING) {
      return 'У вас нет доступа';
    }
    const objects = await this.landlordObjectsService.getAllObjects();

    const htmlObjects = objects.map(o => {
      const mainText = getDefaultObjectText(o);
      const textAgreePlaceOnSites = o.placeOnSites
        ? 'Согласен на размещение на площадках'
        : 'Не согласен на размещение на площадках';
      return '<div>' + textAgreePlaceOnSites + `\n\n` + mainText + '<br><br><br></div>';
    });

    return `<div>${htmlObjects.join('')}</div>`;
  }
}
