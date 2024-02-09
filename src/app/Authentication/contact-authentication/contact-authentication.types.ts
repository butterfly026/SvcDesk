export type AuthenticationInfo = {
    LoginId: string,
    Mobile: string,
    Email: string,
    ChangePasswordOnFirstLogin: boolean,
    Password: string,
    MultiFactorEnabled: boolean,
    Roles: [
      {
        Name: string,
        Default: boolean
      }
    ]
  }