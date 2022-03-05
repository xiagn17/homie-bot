import { ApiObjectResponse } from '../../../../api/landlord-objects/interfaces/landlord-objects.type';
import { ObjectTypeEnum } from '../../../../api/renters/entities/RenterFilters.entity';
import {
  EMOJI_CLOCK,
  EMOJI_COMMENT,
  EMOJI_MONEY,
  EMOJI_NEIGHBORHOODS,
  EMOJI_SUBWAY,
} from '../../../constants/emoji';
import { getAgeText } from '../../../../../utils/texts/get-age-text.helper';

export function getSecondRow(object: ApiObjectResponse): string {
  if (object.objectType === ObjectTypeEnum.apartments) {
    const floors = object.apartmentsInfo.floors;
    const allFloors = floors.split('/')[1];
    const objectFloor = floors.split('/')[0];
    return `<b>${object.roomsNumber}-к КВАРТИРА, ${objectFloor} ЭТАЖ (из ${allFloors})</b>`;
  }
  const type = object.objectType === ObjectTypeEnum.bed ? 'КОЙКО-МЕСТО' : 'КОМНАТА';
  return `<b>${type} В ${object.roomsNumber}-к КВ.</b>`;
}

export function getFiveRow(object: ApiObjectResponse): string {
  if (object.objectType === ObjectTypeEnum.apartments) {
    return '\n';
  }
  const peopleNumber = object.roomBedInfo.livingPeopleNumber;
  const age = getAgeText(object.roomBedInfo.averageAge);
  return `${EMOJI_NEIGHBORHOODS} <i>Соседи</i>: ${peopleNumber} чел., сред. возр. ~${age} лет` + '\n';
}

export function getDetailsRow(object: ApiObjectResponse): string {
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

export function getDefaultObjectText(object: ApiObjectResponse): string {
  const firstRow = `#home${object.number}${object.isAdmin ? ' <i>(админ.)</i>' : ''}` + '\n';
  const secondRow = getSecondRow(object) + '\n\n';
  const thirdRow = `${EMOJI_SUBWAY} <i>Метро</i>: ${object.address}` + '\n';
  const fourRow = `${EMOJI_MONEY} <i>Стоимость</i>: ${object.price}` + '\n';
  const fiveRow = getFiveRow(object) + '\n';
  const detailsRow = getDetailsRow(object) + '\n\n';
  const arrivalRow = `${EMOJI_CLOCK} <i>Заезд</i>: с ${object.startArrivalDate}` + '\n';
  const commentRow = `${EMOJI_COMMENT} <i>Комментарий</i>: ${object.comment}` + '\n';
  return firstRow + secondRow + thirdRow + fourRow + fiveRow + detailsRow + arrivalRow + commentRow;
}
