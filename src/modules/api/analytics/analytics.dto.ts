import { IsString } from 'class-validator';
import { ApiAnalyticsChangeStatusRequestType, BusinessAnalyticsFieldsEnumType } from './analytics.type';

export class AnalyticsChangeStatusDTO implements ApiAnalyticsChangeStatusRequestType {
  @IsString()
  chatId: string;

  @IsString()
  field: BusinessAnalyticsFieldsEnumType;
}
