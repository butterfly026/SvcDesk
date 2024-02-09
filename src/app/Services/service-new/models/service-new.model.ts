export type ServiceTypeItem = {
  Id: string,
  Name: string,
  Display: boolean,
  DisplayOrder: number,
  BillingDescription: string,
  AdditionalInformationField1: string,
  AdditionalInformationField2: string,
  AdditionalInformationField3: string,
  AdditionalInformationField4: string,
  Used: boolean,
  GroupName: string
}

export type CreateServiceRequestBodyChargeOverride = {
  DefinitionId: string;
  Price: number;
  From: Date;
  To: Date;
}

export type CreatServiceRequestBodyCharge = {
  DefinitionId: string;
  UnitPrice: number;
  Price: number;
  From: Date;
  To: Date;
  Unit: string;
  Description: string;
  ServiceProviderId: string;
}

export type CreateServiceRequestBodyServiceGroup = {
  Id: number;
  Name: string;
}

export type CreateServiceRequestBodyContract = {
  ContractInstanceId: number;
  Start: Date;
  End: Date;
  SalesPersonId: string;
}

export type CreateServiceRequestBodyRelatedContact = {
  Id: string;
  RelationshipTypeId: string;
}

export type CreateServiceRequestBodyCostCenter = {
  Id: number;
  Name: string;
  Percentage: number;
}

export type CreateServiceRequestBodyAddress = {
  Type: string;
  Address: string;
  Validate: true;
}

export type CreateServiceRequestBodySite = {
  Id: number;
  Type: string;
  Name: string;
}

export type CreateServiceRequestBodyPortingInformation = {
  PortAlienAccount: string;
  Reason: string;
  LosingServiceProviderId: string;
  LosingServiceProvider: string;
  LosingTechnologyType: string;
  PortingIdentificationType: string;
  PortingIdentificationValue: string;
}

export type CreateServiceRequestBodyHardwareItem = {
  ProductId: string;
  SKU: string;
  Quantity: number;
  Price: number;
  SerialNumber: string;
}

export type CreateServiceRequestBodyAttribute = {
  Id: number;
  Value: string;
}

export type CreateServiceRequestBodyPlan = {
  Id: number;
  OptionId: number;
}

export type CreateServiceRequestBodyNetworkIdentifier = {
  Type: string;
  Value: string;
  EquipmentSerial: string;
  PUK: string;
}

export type CreateServiceRequestBodySalesStakeholder = {
  Type: string;
  Id: string;
}

export type CreateServiceRequestBody = {
  Activate: string;
  ChargeOverrides: CreateServiceRequestBodyChargeOverride[];
  Charges: CreatServiceRequestBodyCharge[];
  ServiceGroups: CreateServiceRequestBodyServiceGroup[];
  Contracts: CreateServiceRequestBodyContract[];
  RelatedContacts:CreateServiceRequestBodyRelatedContact [];
  CostCenters: CreateServiceRequestBodyCostCenter[];
  Addresses: CreateServiceRequestBodyAddress[];
  Sites: CreateServiceRequestBodySite[];
  PortingInformation: CreateServiceRequestBodyPortingInformation;
  Hardware: CreateServiceRequestBodyHardwareItem[];
  Attributes: CreateServiceRequestBodyAttribute[];
  Plans: CreateServiceRequestBodyPlan[];
  ParentServiceReference: number;
  UserLabel: string;
  PIN: number;
  EnquiryPassword: string;
  ConnectDatetime: Date;
  ContactCode: string;
  ServiceTypeId: string;
  ServiceId: string;
  NetworkIdentifiers: CreateServiceRequestBodyNetworkIdentifier[];
  SalesStakeholders: CreateServiceRequestBodySalesStakeholder[];
}

export type CreateServiceResponse= {
  ServiceId: string;
  ServiceReference: number;
  Connected: Date;
}