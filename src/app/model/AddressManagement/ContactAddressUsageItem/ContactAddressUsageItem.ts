import { ContactAddressType } from '../ContactAddressType/ContactAddressType';

export interface ContactAddressUsageItem {
    id: number,
    addressTypeCode: string,
    addressType: string,
    addressId: number,
    addressLine1: string,
    addressLine2: string,
    suburb: string,
    city: string,
    state: string,
    postCode: string,
    countryCode: string,
    country: string,
    databaseId: string,
    addressTypes: ContactAddressType[],
    fromDateTime: string,
    toDateTime: string,
    updatedBy: string
}
