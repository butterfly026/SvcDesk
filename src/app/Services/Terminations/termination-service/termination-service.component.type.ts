export type PayOutOverride = {
  Enabled: boolean;
  Minimum: number;
  Maximum: number;
}
export class TerminationConfigurationEvent {
  Enabled: boolean = false;
  Default: boolean = false;
};
export type NetworkOptions = {
  CloseNetworkEvent: TerminationConfigurationEvent;
  CancelOpenEvents: TerminationConfigurationEvent;
}

export type ChargeOptions = {
  CreditBackFutureCharges: TerminationConfigurationEvent;
  BillFutureCharges: TerminationConfigurationEvent;
  UnloadFutureUsage: TerminationConfigurationEvent;
}

export type BulkApplyOptions = {
  ApplyAll: TerminationConfigurationEvent;
  ApplySameServiceType: TerminationConfigurationEvent;
  ApplyChildren: TerminationConfigurationEvent;
  ApplySiblings: TerminationConfigurationEvent;
}

export type TerminationConfiguration = {
  PayOutOverride: PayOutOverride;
  NetworkOptions: NetworkOptions;
  ChargeOptions: ChargeOptions;
  BulkApplyOptions: BulkApplyOptions;
}