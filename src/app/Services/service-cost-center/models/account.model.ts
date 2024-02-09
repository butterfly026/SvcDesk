export type AccountUsage = {
  UsageType: string;
  EntityId: string;
  Entity: string;
}

export type GeneralLedgerAccount = {
  Id: string;
  Name: string;
  DisplayOrder: number;
  Display: boolean;
  TypeId: string;
  BusinessUnitCode: string;
  Type: string;
  BusinessUnit: string;
  Usage: AccountUsage[];
  CreatedBy: string;
  Created: Date;
  UpdatedBy: string;
  Updated: Date;
}