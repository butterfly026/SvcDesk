export type GetServiceSummaryResponse = {
  Count: number;
  Items: ServiceSummary[];
}

export type ServiceSummary = {
  ServiceTypeCode: string;
  ServiceReference: number;
  ServiceId: string;
  ChargeAmount: number;
  ChargeAmountInc: number;
  UsageAmount: number;
  UsageAmountInc: number;
  UsageStart: Date;
  UsageEnd: Date;
}
