export type CostCenter = {
  Id: number;
  CreatedBy: string;
  Created: Date;
  StatusUpdated: Date;
  EFXId: string;
  Email: string;
  Status: string;
  AllocationType: string;
  AggregationPoint: boolean
  GeneralLedgerAccountCode: string;
  AdditionalInformation3: string;
  AdditionalInformation2: string;
  AdditionalInformation1: string;
  Name: string;
  CustomerReference: string;
  ParentId: number;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type GetCostCenterResponse = {
  Count: number;
  Items: CostCenter[];
}

export type CostCenterConfiguration = {
  Hierarchiers: boolean;
  AllocationType: "BillFixed";
  Percentages: boolean;
  Manager: boolean;
  ChargeAllocation: boolean;
  UsageAllocation: boolean;
  AdditionalInformation1: boolean;
  AdditionalInformation2: boolean;
  AdditionalInformation3: boolean;
  GeneralLedgerAccountCode: boolean;
  AggregationPoint: boolean;
  Email: boolean;
  EFXId: boolean;
}

export type CreateCostCenterRequestBody = {
  ParentId: number;
  ToBillPeriod: number;
  FromBillPeriod: number;
  AllocationType: string;
  EFXId: string;
  Email: string;
  Status: string;
  From: Date;
  AggregationPoint: true;
  AdditionalInformation3: string;
  AdditionalInformation2: string;
  AdditionalInformation1: string;
  Name: string;
  CustomerReference: string;
  Percentage: number;
  GeneralLedgerAccountCode: string;
  To: Date
}

export type GetGeneralLedgerRequest = {
  BusinessUnitCode: string;
  TypeId: string
  SearchString: string
}

export type GetAllCostCentersResponse = {
  Count: number;
  Items: CostCenter[]
}[]

export type UpdateCostCenterRequestBody = {
  ParentId: number,
  CustomerReference: string,
  Name: string,
  AdditionalInformation1: string,
  AdditionalInformation2: string,
  AdditionalInformation3: string,
  GeneralLedgerAccountCode: string,
  AggregationPoint: boolean,
  AllocationType: string,
  Status: string,
  Email: string,
  EFXId: string
}

