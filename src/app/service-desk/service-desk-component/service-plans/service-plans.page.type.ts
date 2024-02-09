export type ServicePlanDetail = {
  Id: number;
  Count: number;
  Plan: string;
}

export type GetServicePlansResponse = {
  Count: number;
  PlanNodes: ServicePlanDetail[];
}