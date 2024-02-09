import { FinancialDocuments } from '../FinancialDocuments/FinancialDocuments';

export interface ContactBills {
    Id: number,
    Sequence: number,
    BillPeriod: string,
    BillCycle: string,
    Source: string,
    BillNumber: string,
    BillDate: string,
    DueDate: string,
    AmountDue: number,
    PreviousBalance: number,
    PaymentAdjustmentAmount: number,
    NewCharges: number,
    InstallmentAmount: number,
    DepositAmount: number,
    RepaymentPlanAmount: number,
    DisputedAmount: number,
    Balance: number,
    CreatedBy: string,
    CreatedDateTime: string,
    LastUpdated: string,
    UpdatedBy: string,
    FinancialDocuments: FinancialDocuments[],
    Currency: string
}
