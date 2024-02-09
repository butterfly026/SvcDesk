import { AccountAddress, AccountAuthentication, AccountEmail, AccountPhone, AccountSecurityQuestion, IdentificationDocument } from ".";

export type AccountStatus = {
  Id: string;
  Status: string;
  Default: boolean;
  CreatedBy: string;
  Created: Date;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type AccountType = 'person' | 'corporation';

export type AccountTypeElement = {
  Value: AccountType;
  Label: 'Person' | 'Corporate';
}

export type CreateAccountRequestBody = {
  BusinessUnitCode: string;
  ParentId: string;
  CreditStatusId: string;
  CreditLimit: number;
  TimeZoneId: number;
  TaxId: number;
  ChannelPartnerId: string;
  BillingCycleCode: string;
  EmailBill: boolean;
  PaperBill: boolean;
  UserDefinedData: [
    {
      Id: string;
      Value: string;
    }
  ],
  IdentificationQuestions: AccountSecurityQuestion[],
  IdentificationItem: IdentificationDocument[],
  ExternalPayId: string;
  Addresses: AccountAddress[],
  Emails: AccountEmail[],
  BusinessNumber: string;
  Key: string;
  TradingName: string;
  Gender: string;
  DateOfBirth: Date;
  Title: string;
  FirstName: string;
  Name: string;
  StatusId: string;
  SubTypeId: string;
  Id: string;
  ContactPhones: AccountPhone[],
  Authentication: AccountAuthentication;
}