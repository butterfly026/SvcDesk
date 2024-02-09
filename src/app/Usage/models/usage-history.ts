
export type ContactUsageHistory = {
  plan_discount: string,
  entry_type: string,
  amount: string,
  taxable: string,
  entry_id: number,
  disc_id: number,
  tariff_num: number,
  planid: number,
  overrideid: string,
  transaction: string,
  discount_type: string,
  DefaultNote: string
}
export type ServiceUsageHistory = {
  plan_slash_discount: string,
  entry_type: string,
  amount: string,
  taxable: string,
  entry_id: number,
  discount_id: number,
  tariff_num: number,
  planid: number,
  overrideid: string,
  transaction: string,
  discount_type: string,
}
export type GetServiceUsageHistory = {
  SkipRecords: number;
  TakeRecords: number;
  CountRecords?: string;
  SearchString?: string;
  Uninvoiced?: boolean,
  From?: string;
  To?: string;
}
export type SourceFile = {
  Id: number,
  Sequence: number,
  CustomerName: string,
  Type: string,
  Status: string,
  Name: string,
  Date: Date,
  SourceData: SourceFileData[],
  CreatedBy: string,
  Created: Date,
  UpdatedBy: string,
  LastUpdated: Date,
};
export type SourceFileData = {
  Column: string,
  Value: string,
};