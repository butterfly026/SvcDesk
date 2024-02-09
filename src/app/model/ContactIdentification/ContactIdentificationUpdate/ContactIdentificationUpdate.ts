import { ContactIdentificationUpdateItem } from '../ContactIdentificationUpdateItem/ContactIdentificationUpdateItem';

export interface ContactIdentificationUpdate {
    ContactCode: string,
    ContactIdentifications: ContactIdentificationUpdateItem[]
}
