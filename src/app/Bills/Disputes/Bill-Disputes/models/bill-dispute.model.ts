export type GetBillDisputesResponse = {
  Count: number;
  BillDisputes: BillDispute[];
}

export type BillDispute = {
  Id: number;
  Created: Date;
  CreatedBy: string;
  SettlementTax: number;
  SettlementAmount: number;
  ContactDetails: string;
  RaisedBy: string;
  ApprovalNotes: string;
  Updated: Date;
  ApprovedBy: string;
  BillNumber: string;
  BillId: number;
  DisputedAmount: number;
  Details: string;
  StatusLastUpdated: Date;
  Status: string;
  Date: Date;
  BillDate: Date;
  UpdatedBy: string;
}

export type UpdateBillDisputesRequest = {
  Date: Date;
  Status: string;
  DisputedAmount: number;
  Details: string;
  RaisedBy: string;
  ContactDetails: string;
  ApprovedById: string;
  ApprovalNotes: string;
  SettlementAmount: number;
  SettlementTax: number;
}