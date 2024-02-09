export type GetServiceSummaryResponse = {
  Count: number;
  ServiceSummaries: ServiceSummary[];
}

export type ServiceSummary = {
  ServiceTypeCode: string;
  ServiceType: string;
  ServiceReference: number;
  ServiceId: string;
  ChargeAmount: number;
  ChargeAmountInc: number;
  UsageAmount: number;
  UsageAmountInc: number;
}