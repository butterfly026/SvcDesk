import { FormControl } from "@angular/forms";

export type ServiceAttributeDataType = 'Undefined' | 'String' | 'Boolean' | 'Date' | 'DateTime' | 'Integer' | 'Currency' | 'Decimal' | 'DateRange' | 'Time' | 'List' | 'AutoCompleteList';

export type ServiceAttribute = {
  Id: number;
  Name: string;
  DefaultValue: string;
  DataType: ServiceAttributeDataType;
  Required: boolean;
  ValidationId: string;
  InProfile: boolean;
}

export type AttributeValidResult = {
  Result: string;
  Message: string;
}

export type ValidationResponse = {
  Valid: boolean;
  Results: AttributeValidResult[];
}

export type AttributeElementFormGroup = {
  Id: FormControl<any>;
  Value: FormControl<any>;
  DataType: FormControl<any>;
  Name: FormControl<any>;
}