export interface RechargeNotification {
    Id: number,
    RechargeTypeId: number,
    RechargeElementId: number,
    MinimumQuantity: number,
    MinimumValue: number,
    Active: boolean,
    ContactEmail: string,
    ContactMobile: string
}
