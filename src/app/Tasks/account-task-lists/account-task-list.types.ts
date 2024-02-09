export type CategoryItem = {
    Id: number,
    Name: string,
    Active: boolean,
    CustomerEditable: boolean,
    DisplayOrder: number,
    Note: string,
    Statuses: [
      {
        Status: string,
        Template: string,
        StatusId: number,
        TemplateId: number,
        CreatedBy: string,
        Created: Date
      }
    ],
    BusinessUnits: [
      {
        Status: string,
        StatusId: string,
        CreatedBy: string,
        Created: Date
      }
    ],
    CreatedBy: string,
    Created: Date,
    UpdatedBy: string,
    Updated: Date
}

export type CategoryTypeItem = {
    Id: number,
    Created: Date,
    CreatedBy: string,
    DefaultStatusId: number,
    DefaultPriorityId: number,
    DefaultGroupId: number,
    AutomaticClosePeriod: number,
    ResourceLocked: boolean,
    CustomerEditable: boolean,
    ApprovalRequired: boolean,
    Note: string,
    DisplayOrder: number,
    Active: boolean,
    ResourcePromptPeriod: number,
    CustomerPromptPeriod: number,
    VisibleToCustomer: boolean,
    MaximumSLANotifications: number,
    SubsequentSLAPeriod: number,
    OpenSLAPeriod: number,
    InitialSLAPeriod: number,
    CategoryId: number,
    Name: string,
    UpdatedBy: string,
    Updated: Date,
}

export type Status = {
     Id  : number,
     Name :  string ,
     SystemStatus :  string ,
     Dependency :  string ,
     Active : boolean,
     DisplayOrder  : number,
     CreatedBy :  string ,
     Created :  Date,
     UpdatedBy :  string ,
     Updated :  Date 
  }

  export type Requestor = {
    Name: string,
  }

  export type Priority = {
    Id: number,
    Name: string,
    Active: boolean,
    DisplayOrder: number,
    CreatedBy: string,
    Created: Date,
    UpdatedBy: string,
    Updated: Date
  }

  export type NextNumber = {
    Number: string,
  }

  export type Resolution = {
    Id: number,
    Name: string,
    Active: boolean,
    DisplayOrder: number,
    CreatedBy: string,
    Created: Date,
    UpdatedBy: string,
    Updated: Date
  }

  
export type DialogDataItem = {
  ContactCode: string,
  EditMode: string,
  IsModal: boolean,
  TaskId: number,
  Data?: any,
}

export type TaskEmail = {
    Id: number,
    Address: string
}
export type AccountTaskItem = {
    Id?: number,
    NextFollowupDate?: Date,
    VisibleToCustomer: boolean,
    Ticket?: boolean,
    FAQ?: boolean,
    FAQTag?: string,
    LastCustomerPrompt?: Date,
    NumberOfCustomerPrompts?: number,
    LastResourcePrompt?: Date,
    NumberOfResourcePrompts?: number,
    LastSLAPrompt?: Date,
    NumberOfSLAPrompts?: number,
    QuotedHours?: number,
    QuotedPrice?: number,
    QuoteFixedPrice?: boolean,
    InvoiceId?: number,
    SLAData?: Date,
    InvoiceNumber?: string,
    EstimatedDate?: Date,
    CustomerRequestedDate?: Date,
    TypeId?: number,
    GroupId?: number,
    Number: string,
    Reference?: string,
    RequestedBy: string,
    Emails?: TaskEmail[],
    StatusId: number,
    ParentId?: number,
    ResolutionId: number,
    PriorityId: number,
    ShortDescription: string,
    Description: string,
    ShortResolution?: string,
    ResolutionDetail?: string,
    RequiredDate?: Date,
    CompletedDate?: Date,
    PercentComplete?: number
}

export type AccountTaskResponse = {
  Count: number,
  Items: AccountTaskItem[],
}

export type TaskDocument = {
  Name: string,
  Category: string,
  FileType: string,
  Note: string,
  Author: string,
  DateAuthored: Date,
  UserEditable: boolean,
  ContactEditable: boolean,
  ContactVisible: boolean,
  Content: string
}

export type TaskDocumentResponse = {
  Count: number,
  Documents: TaskDocument[],
}

export type TaskGroup = {
  Id: number,
  Name: string,
  Active: true,
  DisplayOrder: number,
  CreatedBy: string,
  Created: Date,
  UpdatedBy: string,
  Updated: Date
}