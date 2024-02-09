import { ContactIdentificationMandatoryRule } from '../ContactIdentificationMandatoryRule/ContactIdentificationMandatoryRule';

export interface ContactIdentificationMandatoryRules {
    MandatoryIdentificationTypes: ContactIdentificationMandatoryRule[],
    MinimumPoints: number,
}
