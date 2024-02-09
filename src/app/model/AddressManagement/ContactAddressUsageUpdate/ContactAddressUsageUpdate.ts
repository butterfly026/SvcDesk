import { ContactAddressUsageUpdateItem } from '../ContactAddressUsageUpdateItem/ContactAddressUsageUpdateItem';

export interface ContactAddressUsageUpdate {
    contactCode: string,
    deleteOtherAddresses: boolean,
    contactAddressUsage: ContactAddressUsageUpdateItem[]
}
