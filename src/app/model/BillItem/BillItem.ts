export interface BillItem {
    BillNumber: number,
    BillDate: string,
    AmountDue: number,
    NewCharges: number,
    PreviousAmount: number,
    PaymentAdjusts: number,
    InstallAmount: number,
    DepositAmounts: number,
    Balance: number,
    CycleCode: string,
    InvoiceData: {
        InvoiceNo: number,
        BillNumber: number,
        BillRef: number,
        BillPeriod: number,
        Type: string,
        FinancialDetails: string,
        FinRef: number,
        FinType: string,
        CycleCode: string,
        OtherRef: string,
        ParentRef: string
    },
    ReceiptData: {
        ReceiptNo: number,
        BillNumber: number,
        BillRef: number,
        BillPeriod: number,
        FinancialDetails: string,
        Type: string,
        FinRef: number,
        FinType: string,
        CycleCode: string,
        OtherRef: string,
        ParentRef: string
    }
}
