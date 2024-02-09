export type BillDelegation = {
    Id: number,
    DelegatorAccountId: string,
    DelegatorAccount: string,
    DelegatorName?: string,
    DelegateeAccountId: string,
    DelegateeAccount: string,
    DelegateeName?: string,
    FromBillPeriod: number,
    ToBillPeriod: number,
    ReasonId: number,
    Reason: string,
    Note: string,
    CreatedBy: string,
    Created: Date,
    LastUpdated: Date,
    UpdatedBy: string
  };