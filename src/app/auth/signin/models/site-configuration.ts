
export type SiteConfiguration = {
  BusinessUnitCode: string;
  DefaultSASSURL: string;
  DefaultCurrencyCode: string;
  DefaultLanguage: string;
  DefaultTheme: string;
  ImageFolderURL: string;
  WebsiteURL: string;
  ExcelLogoURL: string;
  PDFLogoURL: string;
  SmallLogoURL: string;
  LogoURL: string;
  ContactName: string;
  ContactFax: string;
  ContactNumber: string;
  ContactEmail: string;
  BusinessUnitColor: string;
  CountryCode: string;
  PostCode: string;
  State: string;
  City: string;
  Suburb: string;
  Address2: string;
  Address1: string;
  Address: string;
  CompanyNumber: string;
  BusinessNumber: string;
  Default: boolean;
  BusinessUnit: string;
  TwoFactorAuthEmail: boolean;
  TwoFactorAuthSMS: boolean;
}

export type PasswordResetConfiguration = {
  EmailLink: boolean;
  SMSReset: boolean;
}
