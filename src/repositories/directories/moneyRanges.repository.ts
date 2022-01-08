import { EntityRepository, In, Repository } from 'typeorm';
import { MoneyRangeEntity, MoneyRangeEnumType } from '../../entities/directories/MoneyRange.entity';

@EntityRepository(MoneyRangeEntity)
export class MoneyRangesRepository extends Repository<MoneyRangeEntity> {
  async getMoneyRangeIdsForRenterMatch(renterMoneyRange: MoneyRangeEntity): Promise<string[]> {
    const getMoneyRanges = async (): Promise<MoneyRangeEntity[]> => {
      if (renterMoneyRange.range === MoneyRangeEnumType.prelow) {
        return this.find({ range: In([MoneyRangeEnumType.prelow, MoneyRangeEnumType.low]) });
      } else if (renterMoneyRange.range === MoneyRangeEnumType.low) {
        return this.find({
          range: In([MoneyRangeEnumType.prelow, MoneyRangeEnumType.low, MoneyRangeEnumType.middle]),
        });
      } else if (renterMoneyRange.range === MoneyRangeEnumType.middle) {
        return this.find({
          range: In([MoneyRangeEnumType.low, MoneyRangeEnumType.middle, MoneyRangeEnumType.high]),
        });
      } else if (renterMoneyRange.range === MoneyRangeEnumType.high) {
        return this.find({ range: In([MoneyRangeEnumType.middle, MoneyRangeEnumType.high]) });
      }
      return [];
    };

    return (await getMoneyRanges()).map(moneyRange => moneyRange.id);
  }

  async getMoneyRangeIdsForLocationMatch(price: string): Promise<string[]> {
    const getMoneyRanges = async (): Promise<MoneyRangeEntity[]> => {
      const rangesToFind: MoneyRangeEnumType[] = [];

      if (isPriceInRange(price, MoneyRangeEnumType.prelow)) {
        rangesToFind.push(MoneyRangeEnumType.prelow);
      }
      if (isPriceInRange(price, MoneyRangeEnumType.low)) {
        rangesToFind.push(MoneyRangeEnumType.low);
      }
      if (isPriceInRange(price, MoneyRangeEnumType.middle)) {
        rangesToFind.push(MoneyRangeEnumType.middle);
      }
      if (isPriceInRange(price, MoneyRangeEnumType.high)) {
        rangesToFind.push(MoneyRangeEnumType.high);
      }

      return this.find({ range: In(rangesToFind) });
    };

    return (await getMoneyRanges()).map(moneyRange => moneyRange.id);
  }
}

export const MONEY_RANGE_DIFF = 5000;
function isPriceInRange(price: string, moneyRange: MoneyRangeEnumType): boolean {
  const rangeExactly = Number(price);
  const range1 = rangeExactly - MONEY_RANGE_DIFF;
  const range2 = rangeExactly + MONEY_RANGE_DIFF;

  const moneyRange1 = Number(moneyRange.split('-')[0]);
  const moneyRange2 = Number(moneyRange.split('-')[1]);

  const exactlyInRange = rangeExactly >= moneyRange1 && rangeExactly <= moneyRange2;
  const plusMinusInRange =
    (moneyRange1 >= range1 && moneyRange1 <= range2) || (moneyRange2 >= range1 && moneyRange2 <= range2);

  return exactlyInRange || plusMinusInRange;
}
