export type ValidationRuleResult = {
    Result: string;
    Message: string;
}

export type ValidationResponse = {
    Id: string;
    Valid: boolean;
    Results: ValidationRuleResult[];
}

export type UserDefineData = {
    Id: string;
    Value: string;
}

export type IdentificationQuestion = {
    QuestionId: number;
    Answer: string;
}

export type IdentificationItem = {
    TypeId: string;
    Value: string;
    ExpiryDate: Date;
    IssueDate: Date;
}

export type AddressTypes = {
    Code: string;
}

export type Address = {
    AddressLine1: string;
    AddressLine2: string;
    Suburb: string;
    City: string;
    State: string;
    PostCode: string;
    CountryCode: string;
    AddressTypes: AddressTypes;
}

export type EmailType = {
    Code: string;
}

export type Email = {
    EmailAddress: string;
    EmailTypes: EmailType[];
}

export type PhoneType = {
    Code: string;
}

export type ContactPhone = {
    PhoneNumber: string;
    PhoneTypes: PhoneType[];
}
export type Authentication = {
    LoginId: string;
    Mobile: string;
    Email: string;
    ChangePasswordOnFirstLogin: boolean;
    Password: string;
}

export type CreateNewAccountRequestBody = {
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
    UserDefinedData: UserDefineData[];
    IdentificationQuestions: IdentificationQuestion[];
    IdentificationItem: IdentificationItem[];
    ExternalPayId: string;
    Addresses: Address[];
    Emails: Email[];
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
    ContactPhones: ContactPhone[];
    Authentication: Authentication;
  }