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
  Hierarchiers: boolean
  AllocationType: "BillFixed";
  Percentages: boolean
  Manager: boolean
  ChargeAllocation: boolean
  UsageAllocation: boolean
  AdditionalInformation1: boolean
  AdditionalInformation2: boolean
  AdditionalInformation3: boolean
  GeneralLedgerAccountCode: boolean
  AggregationPoint: boolean
  Email: boolean
  EFXId: boolean;
}