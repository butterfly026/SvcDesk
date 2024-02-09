 export type ReportItemParam = {    
    IncludeParameters?: boolean,
    IncludeEmails?: boolean,
    SearchString?: string,
    CategoryId?: string,
    ServiceTypeCode?: string,
    SkipRecords: number,
    TakeRecords: number,
    CountRecords: 'Y',
  };

  export type ReportParameterDataType = 'Undefined' | 'String' | 'Boolean' | 'List' | 'LazyList' | 'Date' | 'DateTime' | 'Integer' | 'Decimal' | 'Currency';

  export type ReportEmail = {
    Id: number;
    Address: string;
    Deleted: boolean;
    DisplayOrder: number;
  }

  export type ReportParameter =  {
    Id: number;
    Name: string;
    DataType: ReportParameterDataType;
    Default: string;
    Deleted: boolean;
    Locked: boolean;
    MultipleSelection: boolean;
    Optional: boolean;
    URL: string;
    Tooltip: string;
  }

  export type ReportBusinessUnit = {
    BusinessUnitId: string;
    Name: string;
    CreatedBy: string;
    Created: Date;
  }

  export type Report = {
    Id: string;
    Emails: ReportEmail[];
    UpdatedBy: string;
    LastUpdated: Date;
    Created: Date;
    CreatedBy: string;
    Note: string;
    Schedulable: true;
    ChannelPartnerEnabled: true;
    CustomerEnabled: true;
    Enabled: true;
    ContactRequired: true;
    Category: string;
    CategoryId: number;
    LongDescription: string;
    Name: string;
    Parameters: ReportParameter[];
    BusinessUnits: ReportBusinessUnit[];
  }

  export type GetReportsResponse = {
    Count: number;
    ReportDefinitions: Report[];
  }