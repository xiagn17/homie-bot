import { Injectable } from '@nestjs/common';
import { ApiObjectResponse } from '../../../api/landlord-objects/interfaces/landlord-objects.type';
import { getDefaultObjectText } from '../../renter-objects/texts/helpers/object-preview.helpers';

@Injectable()
export class AdminTextsService {
  getObjectModerationText(object: ApiObjectResponse): string {
    const mainText = getDefaultObjectText(object);
    return `<b>Новый объект от Лендлорда ждёт тебя!</b>\n\n` + mainText;
  }
}
