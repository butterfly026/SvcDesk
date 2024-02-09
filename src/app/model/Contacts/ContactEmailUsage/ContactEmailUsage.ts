import { ContactEmailUsageItem } from '../ContactEmailUsageItem/ContactEmailUsageItem';

import { ContactEmailMandatoryRule } from '../ContactEmailMandatoryRule/ContactEmailMandatoryRule';

import { ContactEmailType } from '../ContactEmailType/ContactEmailType';

export interface ContactEmailUsage {
    ContactEmailUsages: ContactEmailUsageItem[],
    ContactEmailMandatoryRules: ContactEmailMandatoryRule[],
    ContactEmailTypes: ContactEmailType[]
}
