export type GetAvailablePlansResponse = {
  Count: number;
  Plans: AvailablePlan[];
}

export type AvailablePlan = {
  PlanId: number;
  Plan: string;
  DisplayName: string;
  GroupId: string;
  Group: string;
  TypeId: string;
  Type: string;
  TypeDefault: boolean;
  CycleLocked: boolean;
  From: Date;
  To: Date;
  Options: AvailablePlanOption[];
}

export type AvailablePlanOption = {
  Id: number;
  Name: string;
  Default: boolean;
  Order: number;
}

export type PlanChangePeriod = {
  CycleId: string;
  Cycle: string;
  BillPeriodId: number;
  BillPeriod: string;
  From: string;
  Arrears: string;
  Advance: string;
}

export type ScheduledPlan = {
  Id: number;
  PlanId: number;
  PlanName: string;
  OptionId: number;
  OptionName: string;
  Scheduled: string;
  CanCancel: boolean;
  WorkFlowEventId: number;
}

export type BulkApplyOption = 'No' | 'Account' | 'Type' | 'Child' | 'Sibling' | 'Group';

export type PlanChangeConfigurationPropertyName = 
  'TimeOfDay' | 
  'BulkApplyOptions' |
  'ApplyAccount' | 
  'ApplyChildren' | 
  'ApplySameServiceType' | 
  'ApplySiblings' | 
  'ApplyGroup' | 
  'NetworkOptions' |
  'SetPlanChange' |
  'ForceChange' |
  'ChargeOptions' |
  'ReprocessUsage' | 
  'ReprocessSAE' | 
  'ApplyOneOffCharges' ;

export type PlanChangeConfiguration = {
  TimeOfDay: {
    Enabled: boolean;
    Default: boolean;
  },
  BulkApplyOptions: {
    ApplyAccount: {
      Enabled: boolean;
      Default: boolean;
    };
    ApplySameServiceType: {
      Enabled: boolean;
      Default: boolean;
    };
    ApplyChildren: {
      Enabled: boolean;
      Default: boolean;
    };
    ApplySiblings: {
      Enabled: boolean;
      Default: boolean;
    };
    ApplyGroup: {
      Enabled: boolean;
      Default: boolean;
    };
  };
  NetworkOptions: {
    SetPlanChange: {
      Enabled: boolean;
      Default: boolean;
    };
    ForceChange: {
      Enabled: boolean;
      Default: boolean;
    };
  };
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
  };
}