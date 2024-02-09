
export type LogSuccessLoginRequest = {
  LoginId: string;
  ip: string;
  Location: string;
  MFA: boolean;
  OTP: boolean;
}

export type LogFailedLoginRequest = {
  LoginId: string;
  Password: string;
  ip: string;
  Location: string;
  MFA: boolean;
  OTP: boolean;
  Tor: boolean;
  Proxy: boolean;
  Anonymous: boolean;
  KnownAttacker: boolean;
  KnownAbuser: boolean;
  Threat: boolean;
  Bogon: boolean;
}