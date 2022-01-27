import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('/objects')
  getObjectsHtml(@Query('validate') validate: string): Promise<string> {
    return this.adminService.getObjectsHtml(validate);
  }
}
