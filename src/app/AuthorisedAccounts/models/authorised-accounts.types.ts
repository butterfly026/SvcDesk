export type AuthorisedAccountsResponse = {
  Count: number,
  Items: AuthorisedAccountItemDetail[],
}

export type AuthorisedAccountItemDetail = {
  Id: number,
  AccountId: string,
  Name: string,
  From: Date,
  To: Date,
  CreatedBy: string,
  Created: Date,
  UpdatedBy: string,
  LastUpdated: Date,
}

export type AuthorisedAccountItem = {
  AccountId: string,
  From: Date,
  To: Date,
}
export type AuthorisedAccountsAvailableResponse = {
  Count: number,
  Items: AccountItemDetail[],
}

export type AccountItemDetail = {
  Id: string,
  Name: string,
}