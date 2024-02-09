
export type UserDefinedData = {
    Id: number;
    Name: number;
    Value: string;
    Order: string;
    CreatedBy: string;
    Created: string;
    LastUpdated: string;
    UpdatedBy: string;
  }
export type GetUserDefinedData = {
    SkipRecords: number;
    TakeRecords: number;
    CountRecords?: string;
    SearchString?: string;
  }