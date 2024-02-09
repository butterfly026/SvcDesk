export type ServiceProvider = {
  Id: number;
  Name: string;
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