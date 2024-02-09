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

export type AccountAddressMandatoryRule = {
  TypeCode: string;
  Type: string; 
  CreatedBy?: string;
  Created?: Date;
  LastUpdated?: Date;
  UpdatedBy?: string;
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

export type AccountAddress = {
  AddressLine1: string;
  AddressLine2: string;
  Suburb: string;
  City: string;
  State: string;
  PostCode: string;
  CountryCode: string;
  AddressTypes: { Code: string }[];
}

export type AccountAddressPermissionType = 
  'Details' | 
  'New' | 
  'Delete' | 
  'Update' | 
  'History' |
  '';

export type AustralianAddress = {
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

export type MatchedAddress = {
  Address: string;
}

export type AddressConfiguration = {
  DefaultComponent: string;
  DefaultComponentLabel: string;
  AlternateComponent: string;
  AlternateComponentLabel: string;
  ExtendedComponent: string;
  ExtendedComponentLabel:string;
}