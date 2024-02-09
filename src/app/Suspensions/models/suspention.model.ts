export type SuspensionReason = {
  Id: string;
  Name: string;
}

export type SuspensionType = {
  Id: number;
  Name: string;
  Schedulable: boolean;
  UnsuspensionTypeId: number;
  Reasons: SuspensionReason[]
}

export type SuspensionRequest = {
  SuspensionTypeId: number;
  ReasonId: string;
  Scheduled: Date;
  Note: string;
  Set: boolean;
  BulkApply: string;
}

export type SuspensionResponse = {
  RequestId: number;
  Status: string;
}