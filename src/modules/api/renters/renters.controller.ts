import { Body, Controller, Post, Get, UsePipes, Param } from '@nestjs/common';
import { CreateRenterDTO } from './renters.dto';
import { RentersService } from './renters.service';
import { RentersPipe } from './renters.pipe';
import { RentersSerializer } from './renters.serializer';
import { ApiRenterFullType, ApiRenterResponseType } from './renters.type';

@Controller('renters')
export class RentersController {
  constructor(private rentersService: RentersService, private rentersSerializer: RentersSerializer) {}

  // only for Artem
  @Get('/by-phone/:phoneNumber')
  async getRenterInfoForArtem(@Param('phoneNumber') phoneNumber: string): Promise<string> {
    const renter = await this.rentersService.getRenterByPhone(phoneNumber);
    if (!renter) {
      return 'дед выпей таблетки и введи правильный номер';
    }
    const age = new Date().getFullYear() - Number(renter.birthdayYear);
    return `
    <div>
      👋🏻 Имя: ${renter.name}<br>
      💢 Возраст: ${age}<br>
      🧬 Гендер: ${renter.gender}<br>
      🎓 ВУЗ/Образование: ${renter.university ?? '-'}<br>
      🌐 Socials: ${renter.socials}<br>
      📍 Местоположение: ${renter.location.area}; ${renter.subwayStations
      .map(station => station.station)
      .join(', ')}<br>
      ️♏️ Зодиак: ${renter.zodiacSign ?? '-'}<br>
      👀 Интересы: ${renter.interests.map(interest => interest.interest).join(', ')}<br>
      🕒 Плановая дата заезда: ${renter.plannedArrival}<br>
      💵 Бюджет: ${renter.moneyRange.range}<br>
      📝 Предпочтения: ${renter.preferences ?? '-'}<br>
      <br>
      🌐 telegram: @${renter.telegramUser.username ?? renter.phoneNumber}
    </div>
    `;
  }

  @Get('/:chatId')
  async getRenterWithMatches(@Param('chatId') chatId: string): Promise<ApiRenterFullType> {
    const fullRenter = await this.rentersService.getRenterByChatId(chatId);
    return this.rentersSerializer.toResponseRenterExists(fullRenter);
  }

  @Post()
  @UsePipes(new RentersPipe())
  async createRenter(@Body() renter: CreateRenterDTO): Promise<ApiRenterResponseType> {
    const fullCreatedRenter = await this.rentersService.createRenter(renter);
    return this.rentersSerializer.toResponse(fullCreatedRenter);
  }
}
