import { ContactFinancialAllocations } from '../ContactFinancialAllocations/ContactFinancialAllocations';

export interface ContactFinancialTransactionContactCode {
    Amount: number,
    BillNumber: number,
    BillReference: number,
    BusinessUnitCode: string,
    Category: string,
    CategoryCode: string,
    Created: string,
    CreatedBy: string,
    Date: string,
    DueDate: string,
    Id: number
    LastUpdated: string,
    Number: string,
    OpenAmount: number
    OtherReference: string,
    ParentId: number
    Reason: string,
    ReasonCode: string,
    RoundingAmount: number
    RoundingTaxAmount: number
    Service: string,
    ServiceId: string,
    ServiceReference: string,
    Source: string,
    SourceCode: string,
    Status: string,
    StatusCode: string,
    TaxAmount: number
    Type: string,
    TypeCode: string,
    UpdatedBy: string,
}