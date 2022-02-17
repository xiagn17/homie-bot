import { ApiObjectPreviewInterface } from '../../../../api/landlord-objects/interfaces/landlord-objects.type';
import { ObjectTypeEnum } from '../../../../api/renters/entities/RenterFilters.entity';
import { EMOJI_NEIGHBORHOODS } from '../../../constants/emoji';

export function getSecondRow(object: ApiObjectPreviewInterface): string {
  if (object.objectType === ObjectTypeEnum.apartments) {
    const floors = object.apartmentsInfo?.floors as string;
    const allFloors = floors.split('/')[1];
    const objectFloor = floors.split('/')[0];
    return `<b>${object.roomsNumber}-к КВАРТИРА, ${objectFloor} ЭТАЖ (из ${allFloors})`;
  }
  const type = object.objectType === ObjectTypeEnum.bed ? 'КОЙКО-МЕСТО' : 'КОМНАТА';
  return `<b>${type} В ${object.roomsNumber}-к КВ.</b>`;
}

export function getFiveRow(object: ApiObjectPreviewInterface): string {
  if (object.objectType === ObjectTypeEnum.apartments) {
    return '\n';
  }
  const peopleNumber = object.roomBedInfo?.livingPeopleNumber as string;
  const age = object.roomBedInfo?.averageAge as number;
  return `${EMOJI_NEIGHBORHOODS} <i>Соседи</i>: ${peopleNumber} чел., сред. возр. ~${age} лет` + '\n';
}

export function getDetailsRow(object: ApiObjectPreviewInterface): string {
  let outerString = '';
  outerString += getDetailText(`С парой`, object.details.couples) + ' | ';
  outerString += getDetailText(`С животными`, object.details.animals) + ' | ';
  outerString += getDetailText(`Холодильник`, object.details.fridge) + ' | ';
  outerString += getDetailText(`Стиральная м.`, object.details.washer) + ' | ';
  outerString += getDetailText(`Посудомойка`, object.details.dishWasher) + ' | ';
  outerString += getDetailText(`С детьми`, object.details.kids) + ' | ';
  outerString += getDetailText(`Кондиционер`, object.details.conditioner) + ' | ';
  outerString += getDetailText(`Интернет`, object.details.internet);
  return outerString;
}

function getDetailText(detail: string, notCross: boolean): string {
  if (notCross) {
    return detail;
  }
  return `<s>${detail}</s>`;
}
