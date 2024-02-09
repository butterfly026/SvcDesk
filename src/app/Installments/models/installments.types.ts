export type InstallmentItemDetail = {
  Id?: number,
  Created?: Date,
  CreatedBy?: string,
  AccountPaymentMethodId: number,
  Note: string,
  NextInstallmentDue: Date,
  LastDatePaid?: Date,
  InstallmentDay: number,
  InstallmentCycleType: string,
  AmountPaid?: number,
  StatusChangedBy?: string,
  StatusChanged?: Date,
  StatusReason?: string,
  StatusReasonId: number,
  Status: string,
  Amount: number,
  UpdatedBy?: string,
  Updated?: Date
};

export type InstallmentItem = {
  Amount: number,
  Status: string,
  StatusReasonId: number,
  InstallmentCycleType: string,
  InstallmentDay: number,
  NextInstallmentDue: Date,
  AccountPaymentMethodId: number,
  Note: string,
};

export type InstallmentCycleType = 'Monthly' | 'Weekly' | 'Quarterly';
 
export type InstallmentItemResponse = {
  Count: number,
  Items: InstallmentItemDetail[],
}

export type InstallmentStatusReason = {
  Id: number,
  Reason: string,
  CreatedBy: string,
  Created: Date,
  UpdatedBy: string,
  Updated: Date,
};

export type StatusItem = 'Open' | 'Suspended' | 'Cancelled' | 'Completed';

export type StatusHistoryItem = {
  Id: number,
  StatusCode?: string,
  Status?: string,
  From: Date,
  To: Date,
  Note?: string,
  Created: Date,
  CreatedBy?: string,
};

export type DefaultUsageHistoryItem = {
  Id: number,
  From: Date,
  To: Date,
  Created: Date,
  CreatedBy?: string,
};

export type ServiceUsageHistoryItem = {
  Id: number,
  ServiceReference: number,
  ServiceId?: string,
  From: Date,
  To: Date,
  Created: Date,
  CreatedBy?: string,
};

export type PaymentMethodItem = {
  Id: number,
  StatusHistory: StatusHistoryItem,
  UpdatedBy: string,
  LastUpdated: Date,
  CreatedBy:string,
  Created: Date,
  OnlineEnabled: boolean,
  SecondaryToken: string,
  Token: string,
  CustomerOwned: boolean,
  Exported: boolean,
  Exportable: boolean,
  Protected: boolean,
  Protectable: boolean,
  Default: boolean,
  LastUsed: Date,
  Used: boolean,
  Masked: boolean,
  Status: string,
  StatusCode: string,
  BSB: string,
  ExpiryDate: string,
  AccountNumber: string,
  AccountName: string,
  Description: string,
  PaymentMethodCode: string,
  Category: string,
  CategoryCode: string,
  DefaultUsageHistory: DefaultUsageHistoryItem,
  ServiceUsageHistory: ServiceUsageHistoryItem,
}

export class PaymentMethodOption {
  Open: boolean = false;
  DefaultOnly: boolean = false;
};