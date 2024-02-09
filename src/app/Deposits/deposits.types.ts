export type DepositItemDetail = {
  Id?: number,
  Type: string,
  Amount: number,
  Date: Date,
  ExpiryDate: Date,
  Status: string,
  StatusUpdated?: string,
  StatusChangedBy?: string,
  StatusReasonId: number,
  StatusReason?: string,
  Note: string,
  CreatedBy?: string,
  Created?: Date,
  UpdatedBy?: string,
  Updated?: Date
};

export type DepositItem = {
  Type: string,
  Amount: number,
  Date: Date,
  ExpiryDate: Date,
  Status: string,
  StatusReasonId: number,
  Note: string,
};

export type DepositItemResponse = {
  Count: number,
  Deposits: DepositItemDetail[],
}

export type DepositType = 'Roaming' | 'Security' | 'IDD' | 'Other';

export type DepositTypeResponse = {
  Count: number,
  Deposits: DepositType[],
}

export type DepositStatusReason = {
  Id: number,
  Reason: string,
  CreatedBy: string,
  Created: Date,
  UpdatedBy: string,
  Updated: Date
};
export type StatusItem = 'Open' | 'On hold' | 'Approved' | 'Declined' | 'Refunded' | 'Cancel';