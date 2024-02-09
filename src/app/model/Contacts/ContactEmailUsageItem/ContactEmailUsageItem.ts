import { ContactEmailType } from '../ContactEmailType/ContactEmailType';

export interface ContactEmailUsageItem {
    id: number,
    emailAddress: string,
    emailTypes: ContactEmailType[],
    fromDateTime: string,
    created: string,
    createdBy: string,
    lastUpdated: string,
    updatedBy: string
}
