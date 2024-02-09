export type ReceiptAllocationItem = {
  Id: number;
  Created: Date;
  CreatedBy: string;
  Credit: boolean,
  Bill: string;
  TypeCode: string;
  OtherReference: string;
  TaxAmount: number;
  Amount: number;
  Category: string;
  Source: string;
  Status: string;
  Type: string;
  OpenAmount: number;
  Date: string;
  Number: string;
  LastUpdated: Date;
  UpdatedBy: string;
  AmountToAllocate?: number;
}

export type AdditionalInfo = 
{
  Order: number,
  Information: string
}

export type Allocation = {
  Id: number,
  Amount: number
}

export type ReceiptPost = {
  Number: string,
  BankId?: string,
  ExchageRateId?: number,
  Email: boolean,
  CreateDocument: boolean,
  BillTo?: {
    Addressee: string,
    Address1: string,
    Address2: string,
    Suburb: string,
    City: string,
    State: string,
    PostCode: string,
    CountryCode: string
  },
  AdditionalInformation?: AdditionalInfo [ ],
  Allocations: Allocation[ ],
  AutoAllocate: boolean,
  Collect: boolean,
  StatusCode: string,
  SourceCode: string,
  CategoryCode?: string,
  OtherReference: string,
  Note?: string,
  ReasonCode?: string,
  PaymentMethodId?: number,
  SurchargeAmount?: number,
  Amount: number,
  Date: Date,
  ChequeNumber: string,
  ChequeAmount?: number
}