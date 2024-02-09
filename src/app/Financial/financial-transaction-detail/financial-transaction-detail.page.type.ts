type FinancialTransactionDetails = {
  Sequence: number;
  Detail: string;
}

export type FinancialTransactionAllocation = {
  Id: number;
  Created: Date;
  CreatedBy: string;
  BillNumber: string;
  TypeCode: string;
  OtherReference: string;
  TaxAmount: number;
  Amount: number;
  LastUpdated: Date;
  Category: string;
  Status: string;
  Type: string;
  AllocatedAmount: number;
  OpenAmount: number;
  Date: Date;
  Number: string;
  AssignmentDirection: string;
  Source: string;
  UpdatedBy: string;
}

export type FinancialTransactionDistribution = {
  Id: number;
  ServiceId: string;
  ServiceReference: number;
  ServiceTypeCode: string;
  AdjustedDailyAmount: number;
  Control: boolean;
  Comment: string;
  Sign: string;
  To: Date;
  From: Date;
  AdjustedAmount: number;
  TaxAmount: number;
  Amount: number;
  Period: string;
  AccountName: string;
  AccountCode: string;
  Created: Date;
  CreatedBy: string;
}

export type FinancialTransactionSplit = {
  Id: number;
  SplitDirection: string;
  OtherTransactionId: number;
  Number: string;
  Type: string;
  Date: Date;
  Amount: number;
  RefundId: number;
  RefundNumber: string;
  RefundDate: Date;
  RefundAmount: number;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type FinancialTransactionEvent = {
  Id: number;
  Description: string;
  Created: Date;
  CreatedBy: string;
}

export type FinancialTransactionPayRequestLog= {
  Id: number;
  Date: Date;
  LogEntry: string;
  CreatedBy: string;
  Created: Date;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type FinancialTransactionPayRequest = {
  Id: number;
  OriginalRequestId: number;
  MerchantNumber: string;
  RequestingUser: string;
  LastError: string;
  LastErrorCode: string;
  LastPolled: Date;
  NumberOfPolls: number;
  LastSubmitted: Date;
  NumberOfSubmits: number;
  ProviderReference: string;
  STAN: string;
  ManuallyAuthorised: boolean;
  PreAuthorisationNumber: string;
  AuthorisationNumber: string;
  PaymentMethodId: number;
  ReferenceNumber: string;
  SettlementDate: Date;
  Reason: string;
  ReasonId: number;
  Status: string;
  StatusId: number;
  Date: Date;
  Provider: string;
  ProviderId: number;
  TaxAmount: number;
  Amount: number;
  Source: string;
  SourceId: number;
  Type: string;
  TypeId: number;
  Reconciled: boolean;
  Logs: FinancialTransactionPayRequestLog[]
}

export type FinancialTransactionExternalTransaction = {
  Id: number;
  ServiceProviderBankAccount: string;
  ServiceProviderBankBSB: string;
  CustomerProviderBankAccount: string;
  CustomerProviderBankBSB: string;
  ChequeNumber: string;
  CreditCardType: string;
  CreditCardNumber: string;
  CardHolderName: string;
  ExpiryDate: string;
  MerchantId: string;
  BankAccountId: number;
  BankDepositId: number;
  ReasonCode: string;
  CreatedBy: string;
  Created: Date;
  FinancialTransactionNumber: string;
  TransactionType: string;
  TransactionTypeCode: string;
  Notes: string;
  StatusId: number;
  Status: string;
  Date: Date;
  Amount: number;
  Reference: string;
  DebtorCode: string;
  OriginalReference: string;
  LastUpdated: Date;
  OriginalDate: Date;
  SettlementDate: Date;
  AdditionalInformation: string;
  DefaultPayerId: boolean;
  File: string;
  FileId: number;
  FileType: string;
  FileDate: Date;
  PayerId: string;
  UpdatedBy: string;
}

export type FinancialTransactionServiceSummary = {
  ServiceTypeCode: string;
  ServiceReference: number;
  ServiceId: string;
  ChargeAmount: number;
  ChargeAmountInc: number;
  UsageAmount: number;
  UsageAmountInc: number;
  UsageStartDate: Date;
  UsageEndDate: Date;
}

export type FinancialTransactionCharge = {
  Id: number;
  ChargeCode: string;
  Description: string;
  AmountTaxEx: number;
  Tax: number;
  From: Date;
  To: Date;
  ServiceTypeCode: string;
  ServiceReference: number;
  ServiceId: string;
  GeneralLedgerCode: string;
}

export type GetFinancialTransactionResponse = {
  Id: number;
  ReasonCode: string;
  Reason: string;
  OtherReference: string;
  ParentId: number;
  ServiceReference: number;
  ServiceId: string;
  CreatedBy: string;
  Created: Date;
  LastUpdated: Date;
  UpdatedBy: string;
  Details: FinancialTransactionDetails[];
  Allocations: FinancialTransactionAllocation[];
  Distributions: FinancialTransactionDistribution[];
  Splits: FinancialTransactionSplit[];
  Events: FinancialTransactionEvent[];
  PayRequests: FinancialTransactionPayRequest[];
  ExternalTransactions: FinancialTransactionExternalTransaction[];
  Category: string;
  CategoryCode: string;
  Source: string;
  SourceCode: string;
  Type: string;
  BusinessUnitCode: string;
  StatusCode: string;
  Status: string;
  ContactCode: string;
  ContactName: string;
  Number: string;
  Date: Date;
  ServiceSummary: {
    Count: number;
    ServiceSummaries: FinancialTransactionServiceSummary[];
  },
  DueDate: Date;
  TaxAmount: number;
  OpenAmount: number;
  RoundingAmount: number;
  RoundingTaxAmount: number;
  BillId: number;
  BillNumber: string;
  Note: string;
  TypeCode: FinancialTransactionDetilTabTypeCode;
  Amount: number;
  Charges: {
    Count: number;
    List: FinancialTransactionCharge[];
  }
}

export type FinancialTransactionDetilTabTypeCode = 'R' | 'RF' | 'DA' | 'CA' | 'CN';
export type filterType = 'every' | 'some';

export type FinancialTransactionDetilTab = {
  tabLabel: string; 
  typeCodes: FinancialTransactionDetilTabTypeCode[];
  filterType: filterType;
}