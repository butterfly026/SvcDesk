export type GetChargeInstancesResponse = {
  Count: number;
  Items: ChargeInstance[];
}

export type ChargeInstance = {
  Id: number;
  UpdatedBy: string;
  Updated: Date;
  ExternalTransactionId: number;
  ExternalTableName: string;
  OverrideId: number;
  AdvancePeriods: number;
  RevenueAccount: string;
  Cost: number;
  FinancialDocument: string;
  ChargeInAdvance: boolean;
  Prorated: boolean;
  DefinitionFrequencyId: string;
  FrequencyId: string;
  Frequency: string;
  PlanOptionId: number;
  PlanId: number;
  PlanOption: string;
  ProfileId: number;
  Code: string;
  Description: string;
  ServiceReference: number;
  ServiceId: string;
  ServiceType: string;
  Created: Date;
  Period: number;
  To: Date;
  PriceTaxEx: number;
  PriceTaxInc: number;
  UndiscountedPriceTaxEx: number;
  UndiscountedPriceTaxInc: number;
  Plan: string;
  From: Date;
  CreatedBy: string;
}