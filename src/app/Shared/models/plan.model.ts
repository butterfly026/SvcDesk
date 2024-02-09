type BasicValue = {
  Id: string;
  Name: string;
};

export type TransactionPlanVersion = {
  Id: number;
  From: Date;
  To: Date;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type PlanOptionCharge = {
  Id: number;
  Created: Date;
  CreatedBy: string;
  RevenueAccount: string;
  MarkUpPercentage: number;
  FixedMarkup: number;
  MarkupType: string;
  IntervalUnit: string;
  RoundEndInterval: boolean;
  EndInterval: number;
  RoundStartInterval: boolean;
  LastUpdated: Date;
  StartInterval: number;
  AdvancePeriods: number;
  ChargeInAdvance: boolean;
  AutoApplied: boolean;
  Prorated: boolean;
  Frequency: string;
  Price: number;
  To: Date;
  From: Date;
  Name: string;
  ChargeDefinitionId: string;
  DelayMonths: number;
  UpdatedBy: string;
}

export type PlanOptionAttributeCharge = {
  Id: number;
  AttributeCharge: string;
  ChargeDefinitionId: string;
  Charge: string;
  DisplayName: string;
  AttributeDefintion1Id: number;
  AttributeDefintion1: string;
  AttributeDefintion2Id: number;
  AttributeDefintion2: string;
  AttributeBand: string;
  CreatedBy: string;
  Created: Date;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type PlanOptionDiscount = {
  Id: number;
  DiscountId: number;
  Discount: string;
  DiscountLongDescription: string;
  DiscountShortDescription: string;
  From: Date;
  To: Date;
  AutoApplied: boolean;
  Used: boolean;
  CreatedBy: string;
  Created: Date;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type PlanOptionHardwareOption = {
  Id: number;
  DisplyOrder: number;
  Name: string;
  Note: string;
  From: Date;
  To: Date;
  PartShipmentAllowed: boolean;
  URL: string;
  CreatedBy: string;
  Created: Date;
  LastUpdated: Date;
  UpdatedBy: string;
  Options: PlanOptionHardwareSubOption[];
}

export type PlanOptionHardwareSubOption = {
  Id: number;
  ProductId: string;
  MaximumQuantity: number;
  MinimumQuantity: number;
  QuantityAtBasePrice: number;
  Price: number;
  AdditionalPrice: number;
  NumberOfInstallments: number;
  IntallmentFrequency: string;
  DisplyOrder: number;
  CreatedBy: string;
  Created: Date;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type PlanOption = {
  Id: number;
  Name: string;
  Default: boolean;
  Order: number;
  AdditionalInformation1: string;
  AdditionalInformation2: string;
  AdditionalInformation3: string;
  AdditionalInformation4: string;
  ContractId: string;
  Contract: string;
  MinimumScore: number;
  ContractAction: string;
  Charges: PlanOptionCharge[];
  Discounts: PlanOptionDiscount[];
  AttributeCharges: PlanOptionAttributeCharge[];
  HardwareOptions: PlanOptionHardwareOption[];
}

export type Plan = {
  Id: number;
  SalesRank: number;
  ValueRank: number;
  AdditionalInformation1: string;
  AdditionalInformation2: string;
  AdditionalInformation3: string;
  AdditionalInformation4: string;
  URL: string;
  CycleLocked: boolean;
  Created: Date;
  LastUpdated: Date;
  UpdatedBy: string;
  ParentPlan: BasicValue;
  ChildPlan: BasicValue;
  CreatedBy: string;
  Requestor: string;
  Availability: string;
  Name: string;
  DisplayName: string;
  GroupId: string;
  Group: string;
  TypeId: string;
  Type: string;
  Comment: string;
  TypeDefault: boolean;
  Contract: string;
  TransactionPlanId: number;
  TransactionPlan: string;
  From: Date;
  To: Date;
  BillingInterval: string;
  ContractId: string;
  ServiceTypes: BasicValue[];
  TransactionPlanVersions: TransactionPlanVersion[];
  Options: PlanOption[];
};

export type PlanInstance = {
  Id: number;
  Created: Date;
  CreatedBy: string;
  CanCancel: boolean;
  CanClose: boolean;
  BackDate: Date;
  PlanType: string;
  PlanTypeId: string;
  LastUpdated: Date;
  EventId: number;
  From: Date;
  Scheduled: string;
  Option: string;
  OptionId: number;
  Plan: string;
  PlanId: number;
  Status: string;
  To: Date;
  UpdatedBy: string;
}