import { Injectable } from '@nestjs/common';
import { LandlordObjectsService } from '../landlord-objects/landlord-objects.service';

@Injectable()
export class AdminService {
  constructor(private landlordObjectsService: LandlordObjectsService) {}

  async getObjectsHtml(validate: string): Promise<string> {
    const VALIDATE_STRING = 'jidashiyudhj8y273gyubdhwushgyib28376f';
    if (validate !== VALIDATE_STRING) {
      return 'У вас нет доступа';
    }
    const objects = await this.landlordObjectsService.getAllObjects();
    const htmlObjects = objects.map(
      o =>
        `<div>
        👋 #home${o.number}<br>
        Имя ${o.name}<br>
        Телефон ${o.phoneNumber}
        💵 Стоимость: ${o.price} руб./мес<br>
        <br>
        📍Адрес: ${o.address}<br>
        🕐 Заезд: с ${o.startArrivalDate}<br>
        📝 Комментарий: ${o.comment}<br>
        <br><br><br>
    </div>`,
    );

    return `<div>${htmlObjects.join('')}</div>`;
  }
}
