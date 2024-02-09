export interface FinancialDocuments {
    Id: number,
    Type: string,
    Number: string,
    Date: Date,
    DueDate: Date,
    Amount: number,
    TaxAmount: number,
    Source: string,
    ParentId: number,
    CreatedBy: string,
    Created: Date,
    LastUpdated: Date,
    UpdatedBy: string
}
