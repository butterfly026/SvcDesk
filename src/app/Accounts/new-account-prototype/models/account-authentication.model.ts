export type UniqueStatusResponse = {
  Used: boolean;
}

type Result = {
  Result: string;
  Message: string;
}

export type ValidateStatusResponse = {
  Valid: boolean;
  Results: Result[];
}

export type CheckPasswordComplexityResponse = {
  Result: string;
  PasswordStrength: string;
  Reason: string;
}

export type SuggestPassword = {
  Password: string;
}

export type AccountAuthentication = {
  LoginId: string;
  Mobile: string;
  Email: string;
  ChangePasswordOnFirstLogin: boolean;
  Password: string;
}