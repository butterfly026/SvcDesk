export type GetTransactionResponse = {
  Count: number;
  Items: Transaction[];
}

export type Transaction = {
  Id: number;
  Band1RateUnit: string;
  ThirdParty: string;
  Origin: string;
  Tariff: string;
  TariffCode: number;
  RateBandDescription: string;
  UsageGroupOrder: number;
  UsageGroupCode: string;
  UsageGroup: string;
  CostTax: number;
  Cost: number;
  NonDiscountedTax: number;
  NonDiscountedPrice: number;
  Tax: number;
  Price: number;
  UnitOfMeasure: string;
  UnitQuantity: number;
  Duration: string;
  BPartyDescription: string;
  BParty: string;
  StartDateTime: Date;
  ServiceType: string;
  ServiceNarrative: string;
  ServiceId: string;
  ServiceReference: number;
  TaxFree: boolean;
  TransactionComponents: TransactionComponent[];
}

export type TransactionComponent = {
  Id: string;
  Name: string;
  Type: string;
  Amount: number;
  DiscountId: number;
  Discount: string;
  TransactionCategory: string;
  Tariff: string;
  PlanId: number;
  OverrideId: number;
  Taxable: boolean;
}