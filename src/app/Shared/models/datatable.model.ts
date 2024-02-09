export type DatatableAction = {
  row: DatatableRowAction[];
  toolBar: DatatableToolBarAction[];
}

export type Permission = {
  Permission: string;
  Resource: string;
  Type: string;
}

export type SearchOptionEmitEvent = {
  [K in SearchOption]?: any;
}

export interface FetchEmitEvent extends SearchOptionEmitEvent {
  SearchString: string;
  SkipRecords: number;
  TakeRecords: number;
  CountRecords: 'Y';
}

export type DocumentDetail = {
  Id: number;
  Name: string;
  Category: string;
  FileType: string;
  Note: string;
  Author: string;
  DateAuthored: Date;
  UserEditable: boolean;
  ContactEditable: boolean;
  ContactVisible: boolean;
  Content: string;
  CreatedBy: string;
  Created: Date;
  UpdatedBy: string;
  Updated: Date;
}

export type DatatableRowActionButton = {
  actionName: DatatableRowAction;
  toolTiop: string;
  icon: string;
  permissions: PermissionType[];
}

export type DatatableToolBarActionButton = {
  actionName: DatatableToolBarAction;
  toolTiop: string;
  icon: string;
  permissions: PermissionType[];
}

export type MessageForRowDeletion = {
  header: string;
  message: string;
}

export type SearchOption = 'From' | 'To' | 'Uninvoiced' | 'Text';

export type PermissionType = 
  'Details' | 
  'New' | 
  'Delete' | 
  'Update' | 
  'Download' | 
  'Excel' |
  'PDF' |
  'Emails' |
  'Services' |
  'Transactions' |
  'UsageTransactions' |
  'Charges' |
  'Disputes' |
  'ReverseRecentOne' |
  'Status/Update' |
  'Allocations/Reallocate' |
  '';

export type DatatableRowAction = 
  'Delete' | 
  'Update' | 
  'Details' | 
  'Download' | 
  'History' | 
  'End' | 
  'Services' | 
  'Contacts' | 
  'Accounts' | 
  'Transactions' | 
  'UsageTransactions' | 
  'Instances' | 
  'Definitions' | 
  'Profiles' | 
  'Notes' | 
  'Status' | 
  'Reverse' |
  'Disputes' |
  'Charges' |
  'Message' |
  'RowEmail' |
  'Suspend' |
  'UnSuspend' |
  'Flag' |
  'Schedules' |
  'RunSchedule' |
  'RunNow' |
  'PDF' |
  'Excel' |
  'RowRefresh' |
  'UpdateStatus' |
  'Reallocate' ;

  export type DatatableToolBarAction = 
    'Create' |
    'Refresh' |
    'ExportExcel' |
    'Receipt' |
    'Invoice' |
    'CreditNote' |
    'Refund' |
    'DebitNote' |
    'CreditAdjustment' |
    'DebitAdjustment' |
    'SMS' |
    'Email' |
    'ReverseRecentOne' |
    '';