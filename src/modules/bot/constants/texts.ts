import { ObjectTypeEnum } from '../../api/renters/entities/RenterFilters.entity';
import { GenderEnumType } from '../../api/renters/interfaces/renters.type';

export const OBJECT_TYPE_TEXT_MAP = {
  [ObjectTypeEnum.bed]: 'койко-места',
  [ObjectTypeEnum.apartments]: 'квартиры',
  [ObjectTypeEnum.room]: 'комнаты',
};
export const GENDER_TEXT_MAP = {
  [GenderEnumType.MALE]: 'мужчина',
  [GenderEnumType.FEMALE]: 'женщина',
};
