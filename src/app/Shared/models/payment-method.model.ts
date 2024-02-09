export type PaymentMethodStatusHistoryItem = {
  Id: number;
  StatusCode: string;
  Status: string;
  From: Date;
  To: Date;
  Note: string;
  Created: Date;
  CreatedBy: string;
}

export type PaymentMethodDefaultUsageHistoryItem = {
  Id: number;
  From: Date;
  To: Date;
  Created: Date;
  CreatedBy: string;
}

export type PaymentMethodServiceUsageHistoryItem = {
  Id: number;
  ServiceReference: number;
  ServiceId: string;
  From: Date;
  To: Date;
  Created: Date;
  CreatedBy: string;
}

export type PaymentMethod = {
  Id: number;
  StatusHistory: PaymentMethodStatusHistoryItem[];
  UpdatedBy: string;
  LastUpdated: Date;
  Created: Date;
  CreatedBy: string;
  OnlineEnabled: boolean;
  SecondaryToken: string;
  Token: string;
  CustomerOwned: boolean;
  Exported: boolean;
  Exportable: boolean;
  Protected: boolean;
  Protectable: boolean;
  Default: boolean;
  LastUsed: Date;
  Used: boolean;
  Masked: boolean;
  Status: string;
  StatusCode: string;
  BSB: string;
  ExpiryDate: string;
  AccountNumber: string;
  AccountName: string;
  Description: string;
  PaymentMethodCode: string;
  Category: string;
  CategoryCode: string;
  DefaultUsageHistory: PaymentMethodDefaultUsageHistoryItem[];
  ServiceUsageHistory: PaymentMethodServiceUsageHistoryItem[];
}

export type CreditCardValidationMessage = {
  ValidationStatus: string;
  Message: string;
  PayCode: string;
}

export type AddBankPaymentMethodRequestBody = {
  AccountNumber: string;
  AccountName: string;
  BSB: string;
  Default: boolean
  CheckConfiguration: boolean;
}

export type AddCreditCardPaymentMethodRequestBody = {
  PayCode: string;
  FutureDate: Date,
  AccountNumber: string;
  AccountName: string;
  ExpiryDate: Date
  CVV: string
  StartDateTime: Date;
  CustomerOwned: boolean;
  Token: string;
  Tokenise: boolean;
  Exported: boolean;
  ProtectNumber: boolean;
  Default: boolean;
  AllowExisting: boolean;
  CheckConfiguration: boolean;
  Name: string;
  CompanyName: string;
  AddressLine1: string;
  AddressLine2: string;
  City: string;
  State: string;
  Country: string;
  PhoneNumber: string;
}