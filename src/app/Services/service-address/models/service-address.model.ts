export type ServiceAddressType = {
  Code: string;
  Name: string;
}

export type ServiceAddressStateType = {
  Code: string;
  Name: string;
  DisplayOrder: number;
  Default: boolean;
}

export type ServiceAddressUsageHistoryItem = {
  Id: number;
  AddressId: number;
  AddressTypeCode: string;
  AddressType: string;
  AddressLine1: string;
  AddressLine2: string;
  Suburb: string;
  City: string;
  State: string;
  PostCode: string;
  CountryCode: string;
  Country: string;
  FromDateTime: Date;
  ToDateTime: Date;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type ServiceAddressUsageAddressType = {
  Code: string;
  Name: string;
  FromDateTime: Date;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type ServiceAddressUsage = {
  Id: number;
  AddressLine1: string;
  AddressLine2: string;
  Suburb: string;
  City: string;
  State: string;
  PostCode: string;
  CountryCode: string;
  Country: string;
  AddressTypes: ServiceAddressUsageAddressType[];
  LastUpdated: Date;
  UpdatedBy: string;
}

export type ServiceAddressMandatoryRule = {
  TypeCode: string;
  Type: string; 
  CreatedBy?: string;
  Created?: Date;
  LastUpdated?: Date;
  UpdatedBy?: string;
}

export type GetServiceAddressUsageResponse = {
  AddressUsage: ServiceAddressUsage[];
  AddressMandatoryRules: ServiceAddressMandatoryRule[];
  AddressTypes: ServiceAddressType[];
}

export type PostCodeDetail =  {
  Id: number;
  Code: string;
  LocalityName: string;
  StateCode: string;
  StateName: string;
  CountryCode: string;
  CountryName: string;
}

export type CountryDetail  =  {
  Code: string;
  Name: string;
  ISD: string;
  DisplayOrder: number;
  Default: boolean;
}

export type AddressDetail = {
  BuildingName: string;
  State: string;
  Suburb: string;
  StreetSuffixFull: string;
  StreetSuffix: string;
  StreetTypeFull: string;
  StreetType: string;
  Street: string;
  Postcode: string;
  Number: string;
  NumberFirst: string;
  UnitNumber: string;
  UnitTypeFull: string;
  UnitType: string;
  LevelNumber: string;
  LevelTypeFull: string;
  LevelType: string;
  NumberLast: string;
  StreetLine: string;
}

export type AddressRequestBody = {
  AddressLine1: string;
  AddressLine2: string;
  Suburb: string;
  City: string;
  State: string;
  PostCode: string;
  CountryCode: string;
  AddressTypes: string[];
  Address?: string;
  AddressFormat?: string;
  ShowSpinner?: boolean,
  AddressList?: [],
  StateList?: [],
  SuburbList?: [],
}

export type ServiceAddressUpdateRequestBodyAddressUsage = {
  AddressLine1: string;
  AddressLine2: string;
  Suburb: string;
  City: string;
  State: string;
  PostCode: string;
  CountryCode: string;
  AddressTypes: { Code: string }[];
}
export type ServiceAddressUpdateRequestBody = {
  DeleteOtherAddresses: boolean,
  AddressUsage: ServiceAddressUpdateRequestBodyAddressUsage[];
}

export type ServiceAddressPermissionType = 
  'Details' | 
  'New' | 
  'Delete' | 
  'Update' | 
  'History' |
  '';