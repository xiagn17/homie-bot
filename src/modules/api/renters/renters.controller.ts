import { Body, Controller, Post, Get, UsePipes, Param } from '@nestjs/common';
import { CreateRenterDTO } from './renters.dto';
import { RentersService } from './renters.service';
import { RentersPipe } from './renters.pipe';
import { RentersSerializer } from './renters.serializer';
import { ApiRenterFullType, ApiRenterResponseType } from './renters.type';

@Controller('renters')
export class RentersController {
  constructor(private rentersService: RentersService, private rentersSerializer: RentersSerializer) {}

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

  // only for Artem
  @Get('/:phoneNumber')
  async getRenterInfoForArtem(@Param('phone') phoneNumber: string): Promise<string> {
    const renter = await this.rentersService.getRenterByPhone(phoneNumber);
    const age = new Date().getFullYear() - Number(renter.birthdayYear);
    return `
      👋🏻 Имя: ${renter.name}
      💢 Возраст: ${age}
      🧬 Гендер: ${renter.gender}
      🎓 ВУЗ/Образование: ${renter.university ?? '-'}
      🌐 Socials: ${renter.socials}
      📍 Местоположение: ${renter.location.area}; ${renter.subwayStations
      .map(station => station.station)
      .join(', ')}
      ️♏️ Зодиак: ${renter.zodiacSign ?? '-'}
      👀 Интересы: ${renter.interests.map(interest => interest.interest).join(', ')}
      🕒 Плановая дата заезда: ${renter.plannedArrival}
      💵 Бюджет: ${renter.moneyRange.range}
      📝 Предпочтения: ${renter.preferences ?? '-'}
      
      🌐 telegram: @${renter.telegramUser.username ?? renter.phoneNumber}
    `;
  }
}
