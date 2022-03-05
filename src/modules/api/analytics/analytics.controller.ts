import { Controller } from '@nestjs/common';

// todo remove analytics module
@Controller('analytics')
export class AnalyticsController {
  // constructor(private analyticsService: AnalyticsService) {}
  // @Get('/export')
  // async exportToGoogleSheets(): Promise<'Success exported'> {
  //   await this.analyticsService.export();
  //   return 'Success exported';
  // }
  //
  // @Post('/change')
  // async changeStatus(@Body() analyticsChangeStatusDTO: AnalyticsChangeStatusDTO): Promise<void> {
  //   await this.analyticsService.changeStatus(analyticsChangeStatusDTO);
  // }
}
