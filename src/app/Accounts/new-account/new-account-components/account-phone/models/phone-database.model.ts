export type PhoneNumberValidationResponse = {
  Valid: boolean;
  Mobile: boolean;
  Results: PhoneNumberValidationMessage[];
}

export type PhoneNumberValidationMessage = {
  Result: string;
  Message: string;
}
