import { ContactPhoneTypeItem } from '../../ContactPhoneTypeItem/ContactPhoneTypeItem';

export interface ContactPhoneUsageItem {
    Id: number,
    PhoneNumber: string,
    PhoneTypes: ContactPhoneTypeItem[],
    FromDateTime: string,
    LastUpdated: string,
    UpdatedBy: string
}
