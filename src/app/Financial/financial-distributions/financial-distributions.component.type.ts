export type GeneralLedgerDistribution = {
  Id: number;
  ServiceId: string;
  ServiceReference: number;
  ServiceTypeCode: string;
  AdjustedDailyAmount: number;
  Control: true;
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