export type PlanChangeRequestBody = {
  BulkApply: string;
  CancelFuturePlanChanges: string;
  PlanId: number;
  PlanOptionId: number;
  Due: string;
  Note: string;
  OverridePlanChangeFee: number;
  ReprocessUsage: boolean;
  ProcessSAE: boolean;
  ApplyOneOffCharges: boolean;
}

export type AccountPlanChangeConfigurationPropertyName = 
  'TimeOfDay' | 
  'ChargeOptions' |
  'ReprocessUsage' | 
  'ReprocessSAE' | 
  'ApplyOneOffCharges' ;

export type AccountPlanChangeConfiguration = {
  TimeOfDay: {
    Enabled: boolean;
    Default: boolean;
  },
  ScheduledPlanChanges: {
    Enabled: boolean;
    Default: boolean;
    AllowDelete: boolean;
  },
  ChargeOptions: {
    ReprocessUsage: {
      Enabled: boolean;
    };
    ReprocessSAE: {
      Enabled: boolean;
    };
    ApplyOneOffCharges: {
      Enabled: boolean;
    };
  }
};