import { FormArray, FormControl } from "@angular/forms";

export type FirstFormGroup = {
  ServiceTypeId: FormControl<any>; 
};

export type ThirdFormGroup = {
  ServiceId: FormControl<any>;
  Plan: FormControl<any>;
  PlanId: FormControl<any>;
  PlanOptionId: FormControl<any>;
  ConnectionDate: FormControl<any>;
  EndDate: FormControl<any>;
  Status: FormControl<any>;
  EnquiryPassword: FormControl<any>;
  UserName: FormControl<any>;
}

export type SecondFormGroup = {
  isPorting: FormControl<any>;
  ServiceId: FormControl<any>;
  LosingServiceProvider: FormControl<any>;  
  AccountNumber: FormControl<any>;  
  DOB: FormControl<any>;  
  PortingIdentificationType: FormControl<any>;
  PortingIdentificationValue: FormControl<any>; 
  PortAuthorityDate: FormControl<any>;
}

export type ForthFormGroup = {
  Attributes: FormArray<FormControl<any>>;
}

export type FifthFormGroup = {
  ContactAddressUsage: FormArray<FormControl<ServiceNewAddressFormGroup>>
}

export type ServiceNewAddressFormGroup = {
  Address: FormControl<any>;
  AddressLine1: FormControl<any>;
  AddressLine2: FormControl<any>;
  Suburb: FormControl<any>;
  City: FormControl<any>;
  State: FormControl<any>;
  PostCode: FormControl<any>;
  CountryCode: FormControl<any>;
  AddressTypes: FormControl<any>;
  AddressFormat: FormControl<any>;
  ShowSpinner: FormControl<any>;
  AddressList: FormControl<any>;
  StateList: FormControl<any>;
  SuburbList: FormControl<any>;
}