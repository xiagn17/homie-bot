import { Module } from '@nestjs/common';
import { GoogleAuthModule } from '../google-auth/google-auth.module';
import { SheetsParserController } from './sheets-parser.controller';
import { SheetsParserService } from './sheets-parser.service';
import { SheetsParserSerializer } from './sheets-parser.serializer';

@Module({
  imports: [GoogleAuthModule],
  controllers: [SheetsParserController],
  providers: [SheetsParserService, SheetsParserSerializer],
})
export class SheetsParserModule {}
