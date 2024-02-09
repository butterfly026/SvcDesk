import { AliasType } from '../AliasType/AliasType';
import { Titles } from '../Titles/Titles';
import { ContactAlias } from '../ContactAlias/ContactAlias';

export interface ContactNames {
    ContactType: 'P' | 'B',
    Name: string,
    FirstName: string,
    Initials: string,
    Title: string,
    FullName: string,
    ContactAliases: ContactAlias[]
    AliasTypes: AliasType[],
    Titles: Titles[],
}