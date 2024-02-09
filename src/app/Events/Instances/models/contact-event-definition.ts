import { EventTeam } from ".";

export type EventDefinitionDetails = {
  Id: number;
  Code: string
  Type: string;
  Name: string;
  From: Date;
  To: Date;
  CategoryId: string;
  Category: string;
  Schedulable: 'Mandatory' | 'Yes' | 'No';
  TeamMemberSchedulable: 'Yes' | 'No';
  ReSchedulable: 'Yes' | 'No';
  CustomerSchedulable: boolean;
  DocumentUploads: boolean;
  DocumentCustomerView: boolean;
  ServiceDeskDisplay: boolean;
  SelfServiceDisplay: boolean;
  Display: boolean;
  SystemRecord: boolean;
  CustomerEditable: boolean;
  ScheduleDepartmentId: string;
  ContactStatusId: string;
  ServiceStatuses: {
    ScheduleStatusId: string;
    ScheduleStatus: string;
    ServiceTypeId: string;
    ServiceType: string;
    ServiceStatusId: string;
    ServiceStatus: string;
    LastUpdated: Date;
    UpdatedBy: string;
  }[];
  ContactStatus: string;
  TemplateId: number;
  Template: string;
  AutomaticCodeId: string;
  CodePrefix: string;
  ArchiveDays: number;
  DefaultPriority: string;
  Source: string;
  DefaultNote: string;
  SLAIntervalPeriodType: string;
  InitialSLAPeriod: number;
  SubsequentSLAPeriod: number;
  MaximumSLANotifications: number;
  InProgressSLAPeriod: number;
  RecurringIntervalPeriodType: string;
  RecurringInterval: number;
  MaximumRecurringInstances: number;
  SetReference: number;
  Teams: EventTeam[];
  CreatedBy: string;
  Created: Date;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type EventDefinition = {
  Id: number,
  Type: string,
  Code: string,
  Name: string,
  CategoryId: string,
  Category: string,
  Schedulable: string,
  TeamMemberSchedulable: string,
  Reschedulable: boolean,
  DocumentUploads: boolean,
  Teams: EventTeam[],
  DefaultNote: string
}

export type GetContactEventDefinitionsResponse = {
  Count: number;
  Items: EventDefinition[];
}

export type GetContactEventDefinitionsRequest = {
  SkipRecords?: number;
  TakeRecords?: number;
  CountRecords?: string;
  SearchString?: string;
  CategoryId?: string;
}


export type EventDefinitionReason = {
  Id: number;
  Reason: {
    Id: string;
    Reason: string;
    Enabled: true,
    CreatedBy: string;
    Created: Date;
    LastUpdated: Date;
    UpdatedBy: string;
  },
  CreatedBy: string;
  Created: Date;
  LastUpdated: Date;
  UpdatedBy: string;
}