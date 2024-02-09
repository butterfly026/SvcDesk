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