export type DebitAdjustmentRequestBody = {
  Number: string;
  Date: Date;
  Amount: number;
  ReasonCode: string;
  Note: string;
  OtherReference: string;
  CategoryCode: string;
  SourceCode: string;
  StatusCode: string;
}