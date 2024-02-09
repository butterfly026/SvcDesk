import { ContactIdentificationItem } from '../ContactIdentificationItem/ContactIdentificationItem';
import { ContactIdentificationMandatoryRules } from '../ContactIdentificationMandatoryRules/ContactIdentificationMandatoryRules';
import { ContactIdentificationType } from '../ContactIdentificationType/ContactIdentificationType';

export interface ContactIdentification {
    ContactIdentificationItems: ContactIdentificationItem[],
    ContactIdentificationMandatoryRules: ContactIdentificationMandatoryRules[],
    IdentificationTypes: ContactIdentificationType[],
}
