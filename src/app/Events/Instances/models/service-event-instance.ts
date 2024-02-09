import { EventInstance } from ".";

export type GetServiceEventInstancesRequest = {
  SkipRecords: number;
  TakeRecords: number;
  CountRecords?: string;
  SearchString?: string;
  IncludeServiceEvents?: boolean;
  ExcludeNoteEvents?: boolean;
  Overdue?: boolean;
}

export type GetServiceEventInstancesResponse = {
  Count: number;
  Events: EventInstance[]
}

export type CreateServiceEventInstanceRequest = {
  DefinitionId: number;
  Note: string;
  ReasonId: string;
  Due: Date;
  ScheduleStatusId: string;
  ScheduleCodeId: string;
  ScheduleToTeam: string;
  ScheduledToTeamMenber: string;
}