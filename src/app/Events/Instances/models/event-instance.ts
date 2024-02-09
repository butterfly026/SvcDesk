export type ScheduleStatus = 'Closed' | 'Failed' | 'Open' | 'In Progress' | 'Cancelled';

export type AttributInstance = {
  Id: number;
  DefinitionId: number;
  Name: string;
  From: Date;
  To: Date;
  Value: string;
  LastUpdated: Date;
  UpdatedBy: string;
  Editable?: boolean;
  EventId?: number;
}

export type EventInstance = {
  Id: number,
  Created: Date;
  CreatedBy: string;
  Type: string;
  Code: string;
  DefinitionId: number;
  Note: string;
  Attributes: AttributInstance[],
  Reason: string;
  ScheduledTo: string;
  ScheduledBy: string;
  StatusDateTime: Date;
  ScheduleStatus: ScheduleStatus;
  Due: Date;
  Name: string;
  DepartmentScheduledTo: string;
  Service: {
    ServiceReference: number;
    ServiceId: string;
    ServiceType: string;
    StatusCode: string;
    Status: string;
  }
}
