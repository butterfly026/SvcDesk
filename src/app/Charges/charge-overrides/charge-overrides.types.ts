export type ChargeOverride = {
  Type: string;
  ChargeDefinitionId: string;
  MarkUp: number;
  Price: number;
  ChargeOverrideDescription?: string;
  To: Date;
  From: Date;
  PlanId?: number;
  PlanOptionId?: number;
  TerminateOnPlanChange: boolean;
  Id?: number;
  Created?: Date;
  CreatedBy?: string;
  PlanOption?: string;
  Plan?: string;
  ServiceId?: string;
  UpdatedBy?: string;
  ServiceReference?: number;
  Charge?: string;
  Billed?: boolean;
  LastUpdated?: Date;
};

export type DialogDataItem = {
  ContactCode?: string;
  ServiceReference?: string;
  EditMode: string;
  IsModal: boolean;
  Data?: any;
};

export type ChargeDefinition = {
  Id: string;
  Created: Date;
  CreatedBy: string;
  NonPlanServiceTypePricing: [
    {
      CostBasedPriceCalculationType: string;
      Created: Date;
      CreatedBy: string;
      Visible: boolean;
      CostFixedAmount: number;
      CostPercentage: number;
      Cost: number;
      MaximumPrice: number;
      MinimumPrice: number;
      WarningMaximumPrice: number;
      WarningMinimumPrice: number;
      Price: number;
      To: Date;
      From: Date;
      ServiceTypeId: string;
      Id: number;
      UpdatedBy: string;
      Updated: Date;
    }
  ];
  CostBasedPriceType: string;
  Type: string;
  CostMarkup: number;
  Cost: number;
  InvoiceGroup: string;
  InvoiceGroupId: string;
  PrintOnInvoice: boolean;
  DisplayOrder: number;
  Consolidate: boolean;
  AnniversaryType: string;
  LastUpdated: Date;
  AnniversaryTypeId: string;
  Group: string;
  GroupId: number;
  ServiceProviderCode: string;
  Unit: string;
  Prorated: boolean;
  AdvancePeriods: number;
  ChargeInAdvance: boolean;
  FrequencyId: string;
  Frequency: string;
  StandardPrice: number;
  DefaultPrice: number;
  BillDescription: string;
  Name: string;
  RevenueAccount: string;
  UpdatedBy: string;
};

export type OptionDefinition = {
  Id: number;
  Name: string;
  Default: boolean;
  Order: 0;
};
export type PlanDefinition = {
  PlanId: number;
  Plan: string;
  DisplayName: string;
  GroupId: string;
  Group: string;
  TypeId: string;
  Type: string;
  TypeDefault: boolean;
  CycleLocked: boolean;
  From: Date;
  To: Date;
  Options: OptionDefinition[];
};
