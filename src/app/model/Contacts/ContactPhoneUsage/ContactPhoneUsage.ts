import { ContactPhoneUsageItem } from '../ContactPhoneUsageItem/ContactPhoneUsageItem';
import { ContactPhoneMandatoryRule } from '../ContactPhoneMandatoryRule/ContactPhoneMandatoryRule';
import { ContactPhoneTypeItem } from '../../ContactPhoneTypeItem/ContactPhoneTypeItem';

export interface ContactPhoneUsage {
    ContactPhoneUsages: ContactPhoneUsageItem[],
    ContactPhoneMandatoryRules: ContactPhoneMandatoryRule[],
    ContactPhoneTypes: ContactPhoneTypeItem[],
}
