export type IdentificationDocument = {
  TypeId: string;
  Value: string;
  ExpiryDate: Date;
  IssueDate: Date;
}

export type IdentificationType = {
  Id: string;
  Name: string;
  Points: number;
  IsCreditCard: boolean;
  HasExpiryDate: boolean;
  HasIssueDate: boolean;
  ContactTypeApplicability: string;
  AllowDuplicates: boolean;
  Created: Date;
  CreatedBy: string;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type IdentificationMandatoryRule = {
  TypeId: string;
  Type: string;
}

export type GetIdentificationMandatoryResponse = {
  IdentificationTypes: IdentificationMandatoryRule[],
  MinimumPoints: number;
  MinimumNumberOfQuestions: number;
}

export type SecurityQuestion = {
  Id: number;
  Question: string;
  DisplayOrder: number;
  Created: Date;
  CreatedBy: string;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type AccountSecurityQuestion = {
  QuestionId: number;
  Answer: string;
}