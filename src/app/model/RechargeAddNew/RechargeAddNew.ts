export interface RechargeAddNew {
    Created: string,
    CreatedBy: string,
    LastUpdated: string,
    RestrictedPropertiesNames: string,
    UpdatedBy: string,
    AuthorisationNumber: number,
    FinancialTransactionNumber: number,
    Id: number,
    LastError: string,
    LastErrorCode: string,
    LastPolled: string,
    NumberOfPolls: number,
    PayRequestStatus: {
        Created: string,
        CreatedBy: string,
        LastUpdated: string,
        RestrictedPropertiesNames: string,
        UpdatedBy: string,
        Active: boolean,
        Default: boolean,
        Description: string,
        DisplayOrder: number,
        Id: number,
        SystemStatus: string
    },
    PaymentRequestStatusReason: string,
    PreAuthorisationNumber: string,
    ProviderReferenceNumber: string,
    ReferenceNumber: number,
    RequestAmount: number,
    RequestDateTime: string,
    SurchargeAmount: number,
    SystemStatus: string
}
