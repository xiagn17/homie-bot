import { SessionDataInterface } from '../interfaces/session-storage.interface';

export function clearTemporaryPropertiesRenterHelper(session: SessionDataInterface): void {
  session.renter = {
    infoStepsData: {},
    infoStep: undefined,
    infoStepUpdate: false,
    infoFillFrom: undefined,
    viewedObjects: session.renter.viewedObjects,
    firstMenuTip: session.renter.firstMenuTip,
    filterStep: undefined,
    router: undefined,
  };
}

export function clearTemporaryPropertiesLandlordHelper(session: SessionDataInterface): void {
  session.landlord = {
    firstTip: session.landlord.firstTip,
    objectStepsData: {},
    objectStep: undefined,
  };
}

export function clearTemporaryPropertiesInSession(session: SessionDataInterface): void {
  clearTemporaryPropertiesRenterHelper(session);
  clearTemporaryPropertiesLandlordHelper(session);
}
