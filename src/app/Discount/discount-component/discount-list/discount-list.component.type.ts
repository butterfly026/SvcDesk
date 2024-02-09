export type DiscountInstance = {
  Id: number;
  DiscountDefinitionId: number;
  Discount: string;
  From: Date;
  To: Date;
  PreviousTo: Date;
  AutoApply: boolean;
  PlanInstanceId: number;
  Plan: string;
  AggregationId: number;
  ParentDiscountInstanceId: number;
  CreatedBy: string;
  Created: Date;
  LastUpdated: Date;
  UpdatedBy: string;
  ChildDiscounts: any[];
}

export type GetDiscountInstancesResponse = {
  Count: number;
  Items: DiscountInstance[];
}