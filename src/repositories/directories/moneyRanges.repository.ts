import { EntityRepository, In, Repository } from 'typeorm';
import { MoneyRange } from '../../entities/directories/MoneyRange';
import { MoneyRangeEnumType } from '../../modules/api/renters/renters.type';

@EntityRepository(MoneyRange)
export class MoneyRangesRepository extends Repository<MoneyRange> {
  async getMoneyRangeIdsForMatch(renterMoneyRange: MoneyRange): Promise<string[]> {
    const getMoneyRanges = async (): Promise<MoneyRange[]> => {
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
}
