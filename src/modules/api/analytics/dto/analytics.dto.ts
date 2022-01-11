import { IsString } from 'class-validator';
import {
  ApiAnalyticsChangeStatusRequestType,
  BusinessAnalyticsFieldsEnumType,
} from '../interfaces/analytics.type';

export class AnalyticsChangeStatusDTO implements ApiAnalyticsChangeStatusRequestType {
  @IsString()
  chatId: string;

  @IsString()
  field: BusinessAnalyticsFieldsEnumType;
}
