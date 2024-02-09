import { StatusHistory } from '../StatusHistory/StatusHistory'
import { DefaultUsageHistory } from '../DefaultUsageHistory/DefaultUsageHistory'
import { ServiceUsageHistory } from '../ServiceUsageHistory/ServiceUsageHistory'

export interface ContactPaymentMethodItem {
    id: number,
    CategoryCode: string,
    Category: string,
    PaymentMethodCode: string,
    Description: string,
    AccountName: string,
    AccountNumber: string,
    ExpiryDate: string,
    BSB: string,
    StatusCode: string,
    Status: string,
    Masked: boolean,
    Used: boolean,
    LastUsedDateTime: string,
    Default: boolean,
    Protectable: boolean,
    Protected: boolean,
    Exportable: boolean,
    Exported: boolean,
    CustomerOwned: boolean,
    Token: string,
    SecondaryToken: string,
    StatusHistory: StatusHistory[],
    DefaultUsageHistory: DefaultUsageHistory[],
    ServiceUsageHistory: ServiceUsageHistory[],
    CreatedBy: string,
    CreatedDateTime: string,
    LastUpdated: string,
    UpdatedBy: string
}
