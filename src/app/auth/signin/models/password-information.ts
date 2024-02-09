export type PasswordConfiguration = {
  MinimumLength: number,
  EmailRegistrationLabel: string;
  EmailRegistrationQuestion: string;
  MobileRegistrationMandatoryLabel: string;
  MobileRegistrationLabel: string;
  MobileRegistrationQuestion: string;
  MaximumPasswordChangesPerDay: number;
  PasswordChangesBeforeReuse: number;
  TemporaryPasswordExpiryPeriod: number;
  ExpiryPeriod: number;
  UseUserDetails: boolean;
  LoginLockoutMessage: string;
  LoginLockoutPeriod: number;
  MaximumLoginAttempts: number;
  MaximumRepeatingCharacters: number;
  MinimumNumberNumberIntegers: number;
  MinimumNumberUpperCaseCharacters: number;
  MinimumNumberSpecialCharacters: number;
  MinimumStrongLength: number;
  MaximumLength: number;
  EmailRegistrationMandatoryLabel: string;
  PasswordComplexityMessage: string;
}

export type PasswordInformation = {
  MustChange: boolean;
  ExpiryDate: Date;
  ExpiryWarningDate: Date;
  EmailRegistered: boolean;
  EmailVerified: boolean;
  Email: string;
  MobileRegistered: boolean;
  MobileVerified: boolean;
  Mobile: string;
  PasswordConfiguration: PasswordConfiguration;
}
