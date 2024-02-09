export interface ContactPaymentMethodsConfigure {
    CategoryCode: string,
    CategoryName: string,
    Name: string,
    Default: boolean,
    AccountDefault: boolean,
    AccountNameLabel: string,
    AccountNumberLabel: string,
    BSBLabel: string,
    ExpiryDateLabel: string,
    ShowCustomerOwns: string,
    ExpiryDateMandatory: boolean,
    Protectable: boolean,
    Exportable: boolean,
    AccountNumberRegexId: string,
    AccountNumberLength: string
}