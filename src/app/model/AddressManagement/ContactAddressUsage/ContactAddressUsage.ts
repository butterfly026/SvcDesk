import { ContactAddressUsageItem } from '../ContactAddressUsageItem/ContactAddressUsageItem';
import { Country } from '../Country/Country';
import { ContactAddressMandatoryRules } from '../ContactAddressMandatoryRule/ContactAddressMandatoryRule';
import { ContactAddressType } from '../ContactAddressType/ContactAddressType';
import { State } from '../State/State';

export interface ContactAddressUsage {
    contactAddressUsages: ContactAddressUsageItem[],
    contactAddressMandatoryRules: ContactAddressMandatoryRules[],
    contactAddressTypes: ContactAddressType[],
    states: State[],
    countries: Country[]
}
