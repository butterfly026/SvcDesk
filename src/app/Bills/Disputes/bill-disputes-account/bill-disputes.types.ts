export type BillDisputeItem = {
    Id: number,
    Created: Date,
    CreatedBy: string,
    SettlementTax: number,
    SettlementAmount: number,
    ContactDetails: string,
    RaisedBy: string,
    ApprovalNotes: string,
    Updated: Date,
    ApprovedBy: string,
    BillNumber: string,
    BillId: number,
    DisputedAmount: number,
    Details: string,
    StatusLastUpdated: Date,
    Status: string,
    Date: Date,
    BillDate: Date,
    UpdatedBy: string
}

export type DisputeBill =  {
    Id: number,
    BillNumber: string,
    BillPeriod: number,
    BillCycle: string
  }