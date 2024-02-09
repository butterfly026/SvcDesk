export type GetFinancialTransactionsResponse = {
  Count: number;
  FinancialTransactions: FinancialTransaction[];
}


export type FinancialTransaction = {
  Id: number;
  Created: Date;
  CreatedBy: string;
  ServiceId: string;
  ServiceReference: number;
  BusinessUnitCode: string;
  ParentId: number;
  Reason: string;
  ReasonCode: string;
  Category: string;
  CategoryCode: string;
  Source: string;
  SourceCode: string;
  BillReference: number;
  BillNumber: string;
  OtherReference: string;
  RoundingTaxAmount: number;
  RoundingAmount: number;
  OpenAmount: number;
  TaxAmount: number;
  Amount: number;
  DueDate: string;
  Date: string;
  Number: string;
  Status: string;
  StatusCode: string;
  Type: 'Invoice' | 'Receipt' | 'Refund' | 'Credit Note' | 'Credit Adjustment' | 'Debit Note' | 'Debit Adjustment';
  TypeCode: string;
  LastUpdated: Date;
  UpdatedBy: string;
}