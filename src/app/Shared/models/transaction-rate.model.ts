export type TransactionRate = {
  TariffClassId: number;
  RevenueAccountId: string;
  ServiceProviderTariffCode: string;
  Unit: string;
  UnitId: string;
  TariffNumber: number;
  CapType: string;
  CostMultiple: number;
  CapDuration: number;
  CapAmount: number;
  Capping: string;
  MinimumDuration: number;
  MinimumPrice: number;
  UseFinalBand: true;
  Band4: string;
  Band3: string;
  Band2: string;
  Band1: string;
  ConnectPrice: number;
  TimeBand: string;
  TimeBandId: string;
  TariffGroup: string;
  TariffGroupId: string;
  TariffClass: string;
  LastUpdated: Date;
  UpdatedBy: string;
}
export type GetTransactionRatesResponse = {
  Count: number;
  Items: TransactionRate[]
}