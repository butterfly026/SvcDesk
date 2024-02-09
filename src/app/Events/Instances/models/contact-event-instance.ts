import { EventInstance, ScheduleStatus } from ".";

export type GetContactEventInstancesRequest = {
  SkipRecords: number;
  TakeRecords: number;
  CountRecords?: string;
  SearchString?: string;
  IncludeServiceEvents?: boolean;
  ExcludeNoteEvents?: boolean;
  Overdue?: boolean;
}

export type GetContactEventInstancesResponse = {
  Count: number;
  Events: EventInstance[]
}

export type CreateContactEventInstanceRequest = {
  DefinitionId: number;
  Note: string;
  ReasonId: string;
  Due: Date;
  ScheduleStatus: ScheduleStatus;
  ScheduleToTeam: string;
  ScheduledToTeamMember: string;
  Priority: number;
  Reference: string;
  EnableTriggers: true;
  TriggerDue: Date;
  Alert: true;
  RelatedEvent: number;
  RelationshipTypeId: string;
}

export type UpdateContactEventInstanceRequest = {
  ScheduleStatus: string;
  Due: Date;
  Note: string;
  ScheduleToTeam: string;
  ScheduledToTeamMember: string;
  SuppressTriggers: boolean;
}
