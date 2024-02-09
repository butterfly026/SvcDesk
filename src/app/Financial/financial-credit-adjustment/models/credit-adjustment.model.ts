export type CreditAdjustmentRequestBodyAllocation =  {
  Id: number;
  Amount: number;
}

export type CreditAdjustmentRequestBody = {
  Number: string;
  Date: Date;
  Amount: number;
  ReasonCode: string;
  Note: string;
  OtherReference: string;
  CategoryCode: string;
  SourceCode: string;
  StatusCode: string;
  AutoAllocate: boolean;
  Allocations: CreditAdjustmentRequestBodyAllocation[];
}