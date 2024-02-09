export type ServiceNoavtion = {
  FromAccountCode: string;
  ToAccountCode: string;
  NovationDateTime: Date;
  FromServiceReference: number;
  ToServiceReference: number;
};

export type NovateServiceResponse = {
  Id: number;
  ServiceReference: number;
}

export type NovateServiceRequestBody = {
  AccountCode: string;
  PlanId: number;
  PlanOptionId: number;
  Scheduled: Date;
  Note: string;
}

export type NovationContact = {
  Type: string;
  ContactCode: string;
  Name: string;
  StatusId: string;
  Status: string;
  BusinessUnitCode: string;
  BusinessUnit: string;
}

export type ReverseRecentOneRequestBody = {
  Note: string;
}