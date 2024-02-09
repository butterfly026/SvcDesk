import { DefaultUsageHistory } from '../DefaultUsageHistory/DefaultUsageHistory';
import { ServiceUsageHistory } from '../ServiceUsageHistory/ServiceUsageHistory';
import { StatusHistory } from '../StatusHistory/StatusHistory';

export interface ContactPaymentMethods {
    id: number,
    categoryCode: string,
    category: string,
    paymentMethodCode: string,
    description: string,
    accountName: string,
    accountNumber: string,
    expiryDate: string,
    BSB: string,
    statusCode: string,
    status: string,
    masked: boolean,
    used: boolean,
    lastUsedDateTime: string,
    default: boolean,
    protectable: boolean,
    protected: boolean,
    exportable: boolean,
    exported: boolean,
    customerOwned: boolean,
    token: string,
    secondaryToken: string,
    createdBy: number,
    created: string,
    lastUpdated: string,
    updatedBy: number,
    statusHistory: StatusHistory[],
    defaultUsageHistory: DefaultUsageHistory[],
    serviceUsageHistory: ServiceUsageHistory[]
}