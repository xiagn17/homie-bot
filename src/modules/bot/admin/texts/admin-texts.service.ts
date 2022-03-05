import { Injectable } from '@nestjs/common';
import { ApiObjectResponse } from '../../../api/landlord-objects/interfaces/landlord-objects.type';
import { getDefaultObjectText } from '../../renter-objects/texts/helpers/object-preview.helpers';

@Injectable()
export class AdminTextsService {
  getObjectModerationText(object: ApiObjectResponse): string {
    const mainText = getDefaultObjectText(object);
    const textAgreePlaceOnSites = object.placeOnSites
      ? 'Согласен на размещение на площадках'
      : 'Не согласен на размещение на площадках';
    return `<b>Новый объект от Лендлорда ждёт тебя!</b>\n` + textAgreePlaceOnSites + `\n\n` + mainText;
  }
}
