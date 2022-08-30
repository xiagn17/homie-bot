import { LandlordObjectFormStepsData } from '../../session-storage/interfaces/session-storage.interface';
import { ApiLandlordObjectDraft } from '../../../api/landlord-objects/interfaces/landlord-objects.type';
import { PreferredGenderEnumType } from '../../../api/landlord-objects/entities/LandlordObject.entity';

export function getFormData(
  data: LandlordObjectFormStepsData,
  chatId: string,
): ApiLandlordObjectDraft | undefined {
  if (
    !(
      data.name !== undefined &&
      data.phoneNumber !== undefined &&
      data.objectType !== undefined &&
      data.price !== undefined &&
      data.location !== undefined &&
      data.address !== undefined &&
      data.photoIds?.length &&
      data.comment !== undefined &&
      data.roomsNumber !== undefined
    )
  ) {
    return undefined;
  }

  const base: ApiLandlordObjectDraft = {
    name: data.name,
    phoneNumber: data.phoneNumber,
    objectType: data.objectType,
    price: data.price,
    location: data.location,
    address: data.address,
    photoIds: data.photoIds,
    comment: data.comment,
    roomsNumber: data.roomsNumber,
    preferredGender: data.preferredGender ?? PreferredGenderEnumType.NO_DIFFERENCE,

    chatId: chatId,
  };

  return base;
}
