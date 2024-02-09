export type AutoApPlay = 'No' | 'Yes' | 'T';
export type BulkApply = 'No' | 'Type' | 'Sibling' | 'Child' | 'Account' | 'Group';
export type SkipExistCheck = 'No' | 'Yes' | 'Add';

export type CreateDiscountInstanceRequest = {
  DiscountDefinitionId: number;
  From: string;
  To: string;
  AutoApply: AutoApPlay;
  BulkApply: BulkApply;
  ChildAccounts: boolean;
  SkipChecks: boolean;
  SkipExistCheck: SkipExistCheck;
  AdjustDates: boolean;
  ParentServiceDiscountInstanceId: number;
}

export type DiscountDefinition = {
  Id: number;
  LastUpdated: Date;
  Created: Date;
  CreatedBy: string;
  IntervalUnit: string;
  RoundEndInterval: true;
  EndInterval: number;
  RoundStartInterval: true;
  StartInterval: number;
  UpdatedBy: string;
  ChildDiscountDefinitionId: number;
  To: Date;
  From: Date;
  DiscountBillingDescription: string;
  DiscountShortDescription: string;
  DiscountLongDescription: string;
  Discount: string;
  DiscountType: string;
  DiscountTypeId: string;
  DisplayOrder: number;
  ChildDiscounts: any[];
}

export type DiscountDefinitionResponse = {
  Count: number;
  Items: DiscountDefinition[];
}
