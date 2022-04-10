import { ObjectTypeEnum } from '../../renters/entities/RenterFilters.entity';
const ONE_DAY_TIMESTAMP = 1000 * 60 * 60 * 24;

export const OBJECT_APARTMENTS_ACTIVE_TIME_DAYS = 4;
export const OBJECT_ROOMS_BEDS_ACTIVE_TIME_DAYS = 3;
export const getObjectActiveTimestamp = (objectType: ObjectTypeEnum): number =>
  ONE_DAY_TIMESTAMP *
  (objectType === ObjectTypeEnum.apartments
    ? OBJECT_APARTMENTS_ACTIVE_TIME_DAYS
    : OBJECT_ROOMS_BEDS_ACTIVE_TIME_DAYS);

export const OBJECT_APARTMENTS_RENEW_NOTIFICATION_TIME_DAYS = OBJECT_APARTMENTS_ACTIVE_TIME_DAYS - 1;
export const OBJECT_ROOMS_BEDS_RENEW_NOTIFICATION_TIME_DAYS = OBJECT_ROOMS_BEDS_ACTIVE_TIME_DAYS - 1;
export const getObjectRenewTimestamp = (objectType: ObjectTypeEnum): number =>
  ONE_DAY_TIMESTAMP *
  (objectType === ObjectTypeEnum.apartments
    ? OBJECT_APARTMENTS_RENEW_NOTIFICATION_TIME_DAYS
    : OBJECT_ROOMS_BEDS_RENEW_NOTIFICATION_TIME_DAYS);
