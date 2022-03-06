import { SessionDataInterface } from '../interfaces/session-storage.interface';

export function clearTemporaryPropertiesRenterHelper(session: SessionDataInterface): void {
  session.renter = {
    infoStepsData: {},
    infoFillFrom: undefined,
    infoStep: undefined,
    infoStepUpdate: false,
    viewedObjects: session.renter.viewedObjects,
    firstMenuTip: session.renter.firstMenuTip,
    filterStep: undefined,
  };
}

export function clearTemporaryPropertiesLandlordHelper(session: SessionDataInterface): void {
  session.landlord = {
    firstTip: session.landlord.firstTip,
    objectStepsData: {},
    objectStep: undefined,
  };
}
