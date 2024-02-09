export type InstanceParam = {
  DefinitionId: string;
  IncludeParameters: boolean;
  IncludeEmails: boolean;
  SearchString?: string;
  SkipRecords: number;
  TakeRecords: number;
  CountRecords: "Y";
};

export type GetReportInstancesForDefinitionResponse = {
  Count: number;
  Reports: ReportInstance[];
}

export type ReportInstance = {
  Id: number;
  Created: Date;
  CreatedBy: string;
  Delete: boolean;
  ContactId: string;
  Comments: string;
  Category: string;
  Emails: ReportInstanceEmail[],
  CategoryId: string;
  Name: string;
  StatusDateTime: Date;
  Status: string;
  Requested: Date;
  ScheduleId: number;
  DefinitionId: string;
  LongDescription: string;
  Parameters: ReportInstanceParameter[];
}

export type ReportInstanceEmail = {
  Id: number;
  Address: string;
  EmailDefinitionId: number;
  Log: boolean;
  Output: boolean;
}

export type ReportInstanceParameter = {
  Id: number;
  Name: string;
  ParameterDefinitionId: number;
  Value: string;
}

export type DownloadReportInstancesResponse = {
  Id: number;
  Content: string;
  FileName: string;
  FileType: string;
}