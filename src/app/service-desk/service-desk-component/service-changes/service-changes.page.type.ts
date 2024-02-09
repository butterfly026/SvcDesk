export type ServiceChangeDetail = {
  Count: number;
  ChangeType: 'PlanChange' | 'Terminated' | 'Connected';
  From: Date;
}