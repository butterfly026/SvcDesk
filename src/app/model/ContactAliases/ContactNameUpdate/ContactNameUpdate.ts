import { ContactAliasUpdateItem } from '../ContactAliasUpdateItem/ContactAliasUpdateItem';

export interface ContactNameUpdate {
    ContactCode?: string,
    ContactKey?: string,
    Name: string,
    FirstName?: string,
    Initials?: string,
    Title?: string,
    ContactAliases: ContactAliasUpdateItem[]
}
