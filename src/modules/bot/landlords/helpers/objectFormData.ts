import { LandlordObjectFormStepsData } from '../../session-storage/interfaces/session-storage.interface';
import {
  ApiLandlordObjectDraft,
  ApiLandlordObjectDraftBase,
} from '../../../api/landlord-objects/interfaces/landlord-objects.type';
import { ObjectTypeEnum } from '../../../api/renters/entities/RenterFilters.entity';
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
      data.startArrivalDate !== undefined &&
      data.price !== undefined &&
      data.location !== undefined &&
      data.address !== undefined &&
      data.photoIds?.length &&
      data.details !== undefined &&
      data.comment !== undefined &&
      data.roomsNumber !== undefined &&
      data.placeOnSites !== undefined
    )
  ) {
    return undefined;
  }

  const base: ApiLandlordObjectDraftBase = {
    name: data.name,
    phoneNumber: data.phoneNumber,
    objectType: data.objectType,
    startArrivalDate: new Date(data.startArrivalDate),
    price: data.price,
    location: data.location,
    address: data.address,
    photoIds: data.photoIds,
    details: data.details,
    comment: data.comment,
    roomsNumber: data.roomsNumber,

    placeOnSites: data.placeOnSites,
    chatId: chatId,
  };

  if (base.objectType === ObjectTypeEnum.apartments) {
    const baseCast = base as ApiLandlordObjectDraftBase<ObjectTypeEnum.apartments>;
    if (data.apartmentsInfo?.floors) {
      return {
        ...baseCast,
        preferredGender: PreferredGenderEnumType.NO_DIFFERENCE,
        apartmentsInfo: {
          floors: data.apartmentsInfo.floors,
        },
      };
    }

    return undefined;
  }
  if (base.objectType === ObjectTypeEnum.room || base.objectType === ObjectTypeEnum.bed) {
    const baseCast = base as ApiLandlordObjectDraftBase<ObjectTypeEnum.room | ObjectTypeEnum.bed>;
    if (data.roomBedInfo?.livingPeopleNumber && data.roomBedInfo?.averageAge && data.preferredGender) {
      return {
        ...baseCast,
        preferredGender: data.preferredGender,
        roomBedInfo: {
          livingPeopleNumber: data.roomBedInfo.livingPeopleNumber,
          averageAge: data.roomBedInfo.averageAge,
        },
      };
    }

    return undefined;
  }
}
