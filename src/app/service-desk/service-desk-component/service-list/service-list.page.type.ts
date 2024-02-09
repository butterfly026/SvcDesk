export type ServiceDetail = {
  Connected: Date;
  ContractEnd: Date;
  ContractId: number;
  ContractReference: number;
  ContractStart: Date;
  Disconnected: Date;
  Plan: string;
  PlanId: number;
  PlanOption: string;
  PlanOptionId: number;
  ServiceId: number;
  ServiceReference: number;
  ServiceType: string;
  Status: 'Active' | 'Disconnected';
  StatusCode: string;
  UserLabel: string;
}

export type ServiceListResponse = {
  Count: number;
  Services: ServiceDetail[];
}