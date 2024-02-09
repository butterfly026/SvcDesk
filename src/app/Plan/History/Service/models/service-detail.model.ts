export type CostCentre = {
  Id: number;
  Code: string;
  Name: string;
  From: string;
  To: string;
}
export type ServiceDetailBasic = {
  ServiceReference: number;
  ContractStart: Date;
  ContractId: string;
  ContractReference: number;
  UserLabel: string;
  PlanOption: string;
  PlanOptionId: number;
  Plan: string;
  PlanId: number;
  Disconnected: Date;
  Connected: Date;
  Status: string;
  StatusCode: string;
  ServiceTypeId: string;
  ServiceType: string;
  ServiceId: string;
  ContractEnd: Date;
  CostCentres: CostCentre[];
}