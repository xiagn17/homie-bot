import { RentersInfoLifestyleInterface } from '../../../../api/renters/interfaces/renters-info-lifestyle.interface';

export function getLifestyleRow(renterInfoLifestyle: RentersInfoLifestyleInterface): string {
  let outerString = '';
  outerString += getLifestyleText(`Кошка/Собака`, renterInfoLifestyle.dogCat) + ' | ';
  outerString += getLifestyleText(`С детьми`, renterInfoLifestyle.kids) + ' | ';
  outerString += getLifestyleText(`С мал. животными`, renterInfoLifestyle.smallAnimals) + ' | ';
  outerString += getLifestyleText(`Не курю`, renterInfoLifestyle.dontSmoke) + ' | ';
  outerString += getLifestyleText(`Не приемлю алкоголь`, renterInfoLifestyle.dontDrink) + ' | ';
  outerString += getLifestyleText(`Работаю удалённо`, renterInfoLifestyle.workRemotely);
  return outerString;
}

function getLifestyleText(lifestyle: string, notCross: boolean): string {
  if (notCross) {
    return `<i>${lifestyle}</i>`;
  }
  return `<s><i>${lifestyle}</i></s>`;
}
