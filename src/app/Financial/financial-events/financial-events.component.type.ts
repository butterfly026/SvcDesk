
export type GetFinantialEventsResponse = {
  Count: number;
  Events: FinantialEvent[]
}

export type FinantialEvent = {
  Id: number;
  Name: string;
  Due: Date;
  ScheduleStatus: string;
  StatusDateTime: Date;
  ScheduledBy: string;
  ScheduledTo: string;
  DepartmentScheduledTo: string;
  Reason: string;
  Note: string;
  Code: string;
  Type: string;
  CreatedBy: string;
  Created: Date;
}
