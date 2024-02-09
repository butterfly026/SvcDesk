export interface NotificationConfigration {
    Id: number,
    ContactCode: string,
    ContactName: string,
    ServiceReference: string,
    ServiceNumber: string,
    RechargeTypeId: string,
    RechargeType: string,
    RechargeElementId: number,
    RechargeElement: string,
    MinimumQuantity: number,
    MinimumValue: number,
    Active: boolean,
    ContactEmail: string,
    ContactMobile: string,
    CreatedBy: string,
    CreatedDateTime: string,
    LastUpdatedBy: string,
    LastUpdatedDateTime: string,
    RechargeElements: [{
        Id: string,
        MinimumQuantity: number,
        RechargeElement: string,
        RechargeElementId: number
    }]
}
