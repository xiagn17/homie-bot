import { MyContext } from '../../../main/interfaces/bot.interface';
import { LandlordObjectDetailsKeys } from '../../../../api/landlord-objects/interfaces/landlord-object-details.interface';
import { EMOJI_CHECK } from '../../../constants/emoji';

export const KEYBOARD_OBJECT_FORM_DETAILS_PREFIX = 'object_form_details_';
interface ObjectDetailsKeyboardData {
  texts: Record<LandlordObjectDetailsKeys, string>;
  data: Record<LandlordObjectDetailsKeys, string>;
}
export async function objectDetailsKeyboardData(ctx: MyContext): Promise<ObjectDetailsKeyboardData> {
  const session = await ctx.session;
  const texts: Record<LandlordObjectDetailsKeys, string> = {
    couples: wrapCheckText('С парой', session.landlord.objectStepsData?.details?.couples),
    animals: wrapCheckText('С животными', session.landlord.objectStepsData?.details?.animals),
    kids: wrapCheckText('С детьми', session.landlord.objectStepsData?.details?.kids),
    fridge: wrapCheckText('Холодильник', session.landlord.objectStepsData?.details?.fridge),
    washer: wrapCheckText('Стиральная м.', session.landlord.objectStepsData?.details?.washer),
    dishWasher: wrapCheckText('Посудомойка', session.landlord.objectStepsData?.details?.dishWasher),
    conditioner: wrapCheckText('Кондиционер', session.landlord.objectStepsData?.details?.conditioner),
    internet: wrapCheckText('Интернет', session.landlord.objectStepsData?.details?.internet),
  };
  const data: Record<LandlordObjectDetailsKeys, string> = {
    couples: KEYBOARD_OBJECT_FORM_DETAILS_PREFIX + 'couples',
    animals: KEYBOARD_OBJECT_FORM_DETAILS_PREFIX + 'animals',
    kids: KEYBOARD_OBJECT_FORM_DETAILS_PREFIX + 'kids',
    fridge: KEYBOARD_OBJECT_FORM_DETAILS_PREFIX + 'fridge',
    washer: KEYBOARD_OBJECT_FORM_DETAILS_PREFIX + 'washer',
    dishWasher: KEYBOARD_OBJECT_FORM_DETAILS_PREFIX + 'dishWasher',
    conditioner: KEYBOARD_OBJECT_FORM_DETAILS_PREFIX + 'conditioner',
    internet: KEYBOARD_OBJECT_FORM_DETAILS_PREFIX + 'internet',
  };
  return {
    texts,
    data,
  };
}

function wrapCheckText(text: string, toCheck?: boolean): string {
  if (toCheck) {
    return `${EMOJI_CHECK} ${text}`;
  }
  return text;
}
