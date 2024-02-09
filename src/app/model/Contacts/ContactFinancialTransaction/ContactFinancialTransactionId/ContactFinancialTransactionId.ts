import { ContactFinancialAllocations } from '../ContactFinancialAllocations/ContactFinancialAllocations';

export interface ContactFinancialTransactionId {
    id: number,
    type: string,
    statusCode: string,
    status: string,
    contactCode: string,
    contactName: string,
    number: string,
    date: string,
    dueDate: string,
    amount: number,
    taxAmount: number,
    openAmount: number,
    roundingAmount: number,
    billNumber: string,
    note: string,
    typeCode: string,
    sourceCode: string,
    source: string,
    categoryCode: string,
    category: string,
    reasonCode: string,
    reason: string,
    otherReference: string,
    parentId: number,
    serviceReference: string,
    serviceId: string,
    createdBy: string,
    created: string,
    lastUpdated: string,
    updatedBy: string,
    allocations: ContactFinancialAllocations[],
    distributions: [],
    splits: [],
    events: [],
    externalTransactions: [],
    payRequests: []
}