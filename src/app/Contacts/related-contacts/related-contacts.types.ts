export type RelationshipType = {
    Id: string,
    Name: string,
    DisplayOrder?: number,
    Visible?: boolean,
    Note?: string,
    MinimumOccurrences?: number,
    MaximumOccurrences?: number,
    System?: boolean,
    CreatedBy?: string,
    Created?: Date,
    LastUpdated?: Date,
    UpdatedBy?: string
}

export type RelatedContactDetail = {
    Id?: string,
    FamilyName: string,
    FirstName: string,
    Title: string,
    RelationshipTypes: any[],
    MobilePhone?: string,
    Mobile?: string,
    Email?: string,
    DateOfBirth?: Date,
    Gender?: string,
    TimeZoneId?: 0,
    AuthenticationLoginId?: string,
    AuthenticationMobile?: string,
    AuthenticationEmail?: string,
    ChangePasswordOnFirstLogin?: boolean,
    Password?: string
  }

  export type ContactTitles = {    
    Id: string,
    Name: string,
  }

  export type ContactFormItem = {
    TypeCtrl: string,
    TitleCtrl: string,
    FirstNameCtrl: string,
    FamilyNameCtrl: string,
    idx: number,
    Mode: string,
    RelatedContactId: string,
    AuthenticationCtrl: string,
  }

  export type RelatedContact = {
    Id: string,
    RelatedContactCode: string,
    RelatedContact: string,
    Name?: string,
    Type?: string,
    Email: string,
    Mobile: string,
    Relationships: [
      {
        Id: string,
        Name: string,
        From: string,
        CreatedBy: string,
        Created: string,
        LastUpdated: string,
        UpdatedBy: string
      }
    ]
  }

  
export type DialogDataItem = {
  ContactCode: string,
  RelatedId: string,
  EditMode: string,
  Data?: any,
}