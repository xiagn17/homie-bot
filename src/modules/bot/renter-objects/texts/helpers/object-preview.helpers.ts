import { ApiObjectResponse } from '../../../../api/landlord-objects/interfaces/landlord-objects.type';
import { ObjectTypeEnum } from '../../../../api/renters/entities/RenterFilters.entity';
import { EMOJI_COMMENT, EMOJI_MONEY, EMOJI_SUBWAY } from '../../../constants/emoji';

export function getSecondRow(object: ApiObjectResponse): string {
  if (object.objectType === ObjectTypeEnum.apartments) {
    const floorsText = '';
    if (object.roomsNumber === 'Студия') {
      return `<b>СТУДИЯ${floorsText}</b>`;
    }
    return `<b>${object.roomsNumber}к КВАРТИРА${floorsText}</b>`;
  }
  const type = object.objectType === ObjectTypeEnum.bed ? 'КОЙКО-МЕСТО' : 'КОМНАТА';
  return `<b>${type} В ${object.roomsNumber}к КВ.</b>`;
}

export function getFiveRow(): string {
  return '';
}

export function getDetailsRow(): string {
  return '';
}

export function getDefaultObjectText(object: ApiObjectResponse): string {
  const firstRow = `#home${object.number}` + '\n';
  const secondRow = getSecondRow(object) + '\n\n';
  const thirdRow = `${EMOJI_SUBWAY} <i>Метро</i>: ${object.address}` + '\n';
  const fourRow = `${EMOJI_MONEY} <i>Стоимость</i>: ${object.price} руб./мес` + '\n';
  const fiveRow = getFiveRow() + '\n';
  const detailsRow = getDetailsRow();
  const commentRow = `${EMOJI_COMMENT} <i>Комментарий</i>: ${object.comment}` + '\n';
  return firstRow + secondRow + thirdRow + fourRow + fiveRow + detailsRow + commentRow;
}
