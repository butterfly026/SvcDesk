export type GetChargesInstanceResponse = {
  Count: number;
  Items: ChargeInstance[];
}

export type ChargeInstance = {
  Id: number;
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
  Plan: string;
  UndiscountedPriceTaxInc: number;
  UndiscountedPriceTaxEx: number;
  PriceTaxInc: number;
  PriceTaxEx: number;
  To: Date;
  From: Date;
  Period: number;
  ServiceType: string;
  ServiceId: string;
  ServiceReference: number;
  Description: string;
  Code: string;
  ProfileId: number;
  Created: Date;
  CreatedBy: string;
}