export type PhoneType = {
  Code: string
}

export type AccountPhone = {
  PhoneNumber: string;
  PhoneTypes: PhoneType[]
}

export interface AccountPhoneTypeItem {
  Code: string,
  Name: string,
  DefaultFormat: string,
}

export interface AccountPhoneMandatoryRule {
  TypeCode: string,
  Type: string,
}

export type AccountPhoneEmitter = {
  type: string;
  data: boolean
}

export type PhoneNumberValidationResponse = {
  Valid: boolean;
  Mobile: boolean;
  Results: PhoneNumberValidationMessage[];
}

export type PhoneNumberValidationMessage = {
  Result: string;
  Message: string;
}