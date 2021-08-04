import { Module } from '@nestjs/common';
import { SheetsParserController } from './sheets-parser.controller';
import { SheetsParserService } from './sheets-parser.service';
import { GoogleAuthModule } from '../google-auth/google-auth.module';

@Module({
  imports: [GoogleAuthModule],
  controllers: [SheetsParserController],
  providers: [SheetsParserService],
})
export class SheetsParserModule {}
