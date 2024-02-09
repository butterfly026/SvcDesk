import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type AccountTypeFormGroup = {
  AccountType: FormControl<any>;
}

export type AccountDetailsFormGroup = {
  BusinessUnitCode: FormControl<any>;
  Id: FormControl<any>;
  StatusId: FormControl<any>;  
  Key: FormControl<any>;  
  Name: FormControl<any>;  
  SubTypeId: FormControl<any>;
  TradingName: FormControl<any>;
  Gender: FormControl<any>;
  DateOfBirth: FormControl<any>;
  Title: FormControl<any>;
  FirstName: FormControl<any>;
}

export type AccountPhoneFormGroup = {
  PhoneNumber: FormControl<any>;
  PhoneTypes: FormControl<any>;
}

export type AccountContactPhonesFormGroup = {
  ContactPhones: FormArray<FormGroup<AccountPhoneFormGroup>>;
}

export type AccountEmailFormGroup = {
  EmailAddress: FormControl<any>;
  EmailTypes: FormControl<any>;
}

export type AccountEmailsFormGroup = {
  Emails: FormArray<FormGroup<AccountEmailFormGroup>>;
}

export type AccountAddressFormGroup = {
  Address: FormControl<any>;
  AddressLine1: FormControl<any>;
  AddressLine2: FormControl<any>;
  Suburb:FormControl<any>;
  City:FormControl<any>;
  State:FormControl<any>;
  PostCode:FormControl<any>;
  CountryCode:FormControl<any>;
  AddressTypes:FormControl<any>;
  AddressFormat:FormControl<any>;
}

export type AccountAddressesFormGroup = {
  Addresses: FormArray<FormGroup<AccountAddressFormGroup>>;
}

export type AccountOptionsFormGroup = {
  CreditLimit: FormControl<any>;
  BillingCycleCode: FormControl<any>;
  EmailBill: FormControl<any>;
  PaperBill: FormControl<any>;
  CreditStatusId: FormControl<any>;
  ChannelPartnerId: FormControl<any>;
  TimeZoneId: FormControl<any>;
  TaxId: FormControl<any>;
}

export type AccountIdentificationDocumentFormGroup = {
  TypeId: FormControl<any>;
  Value: FormControl<any>;
  ExpiryDate: FormControl<any>;
  IssueDate: FormControl<any>;
}

export type AccountIdentificationDocumentsFormGroup = {
  IdentificationItem: FormArray<FormGroup<AccountIdentificationDocumentFormGroup>>;
}

export type AccountSecurityQuestionFormGroup = {
  QuestionId: FormControl<any>;
  Answer: FormControl<any>;
}

export type AccountSecurityQuestionsFormGroup = {
  IdentificationQuestions: FormArray<FormGroup<AccountSecurityQuestionFormGroup>>
}

export type AccountAuthenticationFormGroup = {
  LoginId: FormControl<any>;
  Email: FormControl<any>;
  Mobile: FormControl<any>;
  Password: FormControl<any>;
  ChangePasswordOnFirstLogin: FormControl<any>;
}