export interface AutoPurchaseConfiguration {
    Id: number,
    ContactCode: string,
    ContactName: string,
    ServiceReference: string,
    ServiceNumber: string,
    AutoPurchaseType: string,
    RechargeTypeId: number,
    RechargeType: string,
    AutoPurchaseElementThresholds: [
        {
            Id: number,
            AutoRechargeConfigurationId: number,
            RechargeElementId: number,
            RechargeElement: string,
            MinimumQuantity: number,
            CreatedBy: string,
            CreatedDateTime: string,
            LastUpdatedBy: string,
            LastUpdatedDateTime: string
        }
    ],
    MaxRechargeNumber: number,
    MinimumValue: number,
    DayOfMonth: number,
    FromDateTime: string,
    ToDateTime: string,
    Active: boolean,
    Note: string,
    CreatedBy: string,
    CreatedDateTime: string,
    LastUpdatedBy: string,
    LastUpdatedDateTime: string
}