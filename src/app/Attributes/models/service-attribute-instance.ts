

export type ServiceAttributeInstance = {
    Id: number,
    DefinitionId: string;
    Name: string;
    Value: string;
    From: Date;
    To: Date;
    Editable: string;
    EventId: string;
    LastUpdated: Date;
    UpdatedBy: string;
}

export type GetServiceAttributeInstancesRequest = {
    SkipRecords: number;
    TakeRecords: number;
    CountRecords?: string;
    SearchString?: string;
    IncludeServiceEvents?: boolean;
    ExcludeNoteEvents?: boolean;
    Overdue?: boolean;
  }