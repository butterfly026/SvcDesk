export type AllocateRequestBody = {
  CreateEvent: boolean;
  Note: string;
  ReasonCode: string;
  DeleteExisting: boolean;
  ZeroBalanceOnly: boolean;
  UseDates: boolean;
}

export type FinancialTransactionReason = {
  Code: string;
  Name: string;
  CreatedBy: string;
  Created: Date
  LastUpdated: Date
  UpdatedBy: string;
}