import { ContactPhone } from '../ContactPhone/ContactPhone';
import { Address } from '../Address/Address';
import { ServicesSummary } from '../ServicesSummary/ServicesSummary';
import { Email } from '../Email/Email';

export interface ContactSearchItem {
    Type: string,
    SubType: string,
    BusinessUnitCode: string,
    BusinessUnit: string,
    Status: string,
    StatusCode: string,
    Code: string,
    Name: string,
    DateOfBirth: string,
    ContactPhones: ContactPhone[],
    Addresses: Address[],
    ServiceTypes: ServicesSummary[],
    Emails: Email[]
}
