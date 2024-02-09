import { ContactAddressTypeCode } from '../ContactAddressTypeCode/ContactAddressTypeCode';

export interface ContactAddressUsageUpdateItem {
    addressLine1: string,
    addressLine2: string,
    suburb: string,
    city: string,
    state: string,
    postCode: string,
    countryCode: string,
    databaseId: string,
    addressTypes: ContactAddressTypeCode[]
}
