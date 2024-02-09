 export type ScheduleParam = {
    DefinitionId: string,
    IncludeParameters: boolean,
    IncludeEmails: boolean,
    SearchString?: string,
    SkipRecords: number,
    TakeRecords: number,
    CountRecords: 'Y',
  };

  export type GetShceduledReportsForDefinitionResponse = {
    Count: number;
    Reports: ShceduledReport[];
  }

  export type ShceduledReport = {
    Id: number;
    Created: Date;
    CreatedBy: string;
    RequestingUser: string;
    To: Date;
    From: Date;
    Sunday: true,
    Saturday: true,
    Friday: true,
    Thursday: true,
    Wednesday: true,
    Tuesday: true,
    Monday: true,
    DayOfMonth: number;
    Parameters: ShceduledReportParameter[],
    Emails: ShceduledReportEmail[],
    Priority: number;
    OutputFileName: string;
    Comments: string;
    Name: string;
    Datetime: Date;
    DefinitionId: string;
    LastUpdated: Date;
    UpdatedBy: string;
  }

  export type ShceduledReportParameter = {
    Id: number;
    Name: string;
    ParameterDefinitionId: number;
    Value: string;
  }

  export type ShceduledReportEmail = {
    Id: number;
    Address: string;
    EmailDefinitionId: number;
    Log: true,
    Output: true
  }
