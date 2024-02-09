export type BillingCycle = {
  Id: string;
  Name: string;
  Default: boolean;
  DisplayOrder: number;
  DayOfMonth: number;
  Display: boolean;
  IntervalUnits: string;
  Interval: number;
  Source: string;
  ConfigurationId: string;
  CreatedBy: string;
  Created: Date;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type Tax = {
  Id: number;
  Name: string;
  TaxCode: string;
  Default: boolean;
  CreatedBy: string;
  Created: Date;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type TimeZone = {
  Id: number;
  Name: string;
  CountryId: string;
  Country: string;
}

export type CreditStatus = {
  Id: string;
  Status: string;
  CreatedBy: string;
  Created: Date;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type ChannelPartner = {
  Id: string;
  ContactId: string;
  FullName: string;
  FirstName: string;
  Name: string;
  Status: string;
  StatusId: number;
  Category: number;
  CategoryId: string;
  CreatedBy: string;
  Created: Date;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type GetChannelPartnersResponse = {
  Count: number;
  Items: ChannelPartner[];
}