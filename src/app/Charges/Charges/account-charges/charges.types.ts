export type ChargeItem = {
    Id: number;
    ServiceReference: string;
    ServiceId: string;
    ServiceTypeId: string;
    ServiceType: string;
    Source: string;
    Status: string;
    DefinitionId: string;
    Description: string;
    ProviderCode: string;
    From: Date;
    To: Date;
    InvoicedTo: string;
    BillDescription: string;
    Price: string;
    DiscountAmount: number;
    DiscountPercentage: string;
    Type: string;
    Plan: string;
    PlanOption: string;
    PlanId: string;
    PlanOptionId: string;
    CustomerReference: string;
    Reference: string;
    OtherReference: string;
    Frequency: string;
    Unit: string;
    Quantity: number;
    Prorated: string;
    Editable: string;
    ChargeInAdvance: string;
    AdvancePeriods: string;
    DiscountBased: string;
    AttributeBased: string;
    AutoSourceId: string;
    GeoBased: string;
    DisplayEndDate: Date;
    Cost: number;
    OverRideId: string;
    OverRidePrice: string;
    OverMarkUp: string;
    ETF: string;
    ExternalSource: string;
    RevenueAccount: string;
    ExternalTableName: string;
    ExternalTransactionId: string;
    CreatedBy: string;
    Created: Date;
    LastUpdated: Date;
    UpdatedBy: string;
}

export type ChargeReqParam = {
    SearchString?: string,
    SkipRecords: number,
    TakeRecords: number,
    CountRecords: 'Y',
    CurrentOnly: boolean,
    AccountOnly: boolean,
};


export type ChargeInstanceItem = {
    Id: number,
    FrequencyId: string,
    DefinitionFrequencyId: string,
    Prorated: boolean,
    ChargeInAdvance: boolean,
    AdvancePeriods: number,
    FinancialDocument: string,
    Frequency: string,
    Reversal: boolean,
    RevenueAccount: string,
    OverrideId: number,
    ExternalTableName: string,
    ExternalTransactionId: number,
    CreatedBy: string,
    Created: Date,
    Cost: number,
    LastUpdated: Date,
    PlanOptionId: number,
    PlanOption: string,
    ProfileId: number,
    DefinitionId: string,
    Description: string,
    OverrideDescription: string,
    Period: number,
    BillingCycleId: string,
    PlanId: number,
    BillingCycle: string,
    To: Date,
    PriceTaxEx: number,
    PriceTaxInc: number,
    UndiscountedPriceTaxEx: number,
    UndiscountedPriceTaxInc: number,
    Plan: string,
    From: Date,
    UpdatedBy: string
}

export type ChargeProfile = {
    DefinitionId?: string,
    ContraIfSuspended?: boolean,
    RevenueAccount?: string,
    OtherReference: string,
    Reference: string,
    CustomerReference: string,
    Note: string,
    PlanInstanceId?: number,
    NumberOfInstances?: number,
    AdvancePeriods?: number,
    ChargeInAdvance?: boolean,
    Prorated?: boolean,
    ETF?: boolean,
    Frequency: string,
    OverrideDescription: string,
    AdjustToDisconnection?: boolean,
    To: Date,
    From: Date,
    Cost: number,
    UnitDiscountPercentage: number,
    UnitDiscount: number,
    UnitPrice: number,
    Quantity: number,
    Units: string,
    Amount: number,
    InvoiceDescription: string,
    CheckLimits: boolean
}

export type ValidateType = {
    DefinitionId: string,
    From: string,
    To: string,
    Amount: number,
    Quantity: number,
    UnitPrice: number,
    Discount?: number,
    DiscountPercentage?: number,
    Cost?: number,
    Frequency: string,
    CheckLimits: boolean,
};