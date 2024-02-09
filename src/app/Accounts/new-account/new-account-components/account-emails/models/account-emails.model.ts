export type AccountEmailsEmitter = {
  type: string;
  data: boolean
}

export type AccountEmailTypeItem = {
  Code: string;
  Name: string;
  Created: Date;
  CreatedBy: string;
  LastUpdated: Date;
  UpdatedBy: string
}

export type AccountEmailType = {
  Code: string
}

export type AccountEmail = {
  EmailAddress: string;
  EmailTypes: AccountEmailType[]
}

export interface AccountEmailMandatoryRule {
  typeCode: string,
  type: string
}