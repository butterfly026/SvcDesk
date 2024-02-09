export type CredentialSuccessDetails = {
  type: string,
  credentials: string
}

export type CredentialFailureDetails = {
  type: string,
  title: string,
  status: number,
  detail: string,
  instance: string
}

export type RefreshTokenRequest = {
  UserId: string; 
  Password: string;
  SiteId: string;
  signType?: 'email' | 'contactcode' | 'username' | 'code';
}