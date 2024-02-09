export type AccountAddressType = {
  Code: string;
  Name: string;
}

export type AccountAddressStateType = {
  Code: string;
  Name: string;
  DisplayOrder: number;
  Default: boolean;
}

export type AccountAddressUsageHistoryItem = {
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

export type AccountAddressUsageAddressType = {
  Code: string;
  Name: string;
  FromDateTime: Date;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type AccountAddressUsage = {
  Id: number;
  AddressLine1: string;
  AddressLine2: string;
  Suburb: string;
  City: string;
  State: string;
  PostCode: string;
  CountryCode: string;
  Country: string;
  AddressTypes: AccountAddressUsageAddressType[];
  LastUpdated: Date;
  UpdatedBy: string;
}

export type AccountAddressMandatoryRule = {
  TypeCode: string;
  Type: string; 
  CreatedBy?: string;
  Created?: Date;
  LastUpdated?: Date;
  UpdatedBy?: string;
}

export type GetAccountAddressUsageResponse = {
  AddressUsage: AccountAddressUsage[];
  AddressMandatoryRules: AccountAddressMandatoryRule[];
  AddressTypes: AccountAddressType[];
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

export type AccountAddressUpdateRequestBodyAddressUsage = {
  AddressLine1: string;
  AddressLine2: string;
  Suburb: string;
  City: string;
  State: string;
  PostCode: string;
  CountryCode: string;
  AddressTypes: { Code: string }[];
}
export type AccountAddressUpdateRequestBody = {
  DeleteOtherAddresses: boolean,
  AddressUsage: AccountAddressUpdateRequestBodyAddressUsage[];
}

export type AccountAddressPermissionType = 
  'Details' | 
  'New' | 
  'Delete' | 
  'Update' | 
  'History' |
  '';