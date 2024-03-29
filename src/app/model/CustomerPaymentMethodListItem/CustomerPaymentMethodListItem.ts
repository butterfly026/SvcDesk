/**
 * Payment
 * This API contains Customer Payment methods
 *
 * OpenAPI spec version: 1.0.0
 * Contact: gielisg@selectsoftware.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


export interface CustomerPaymentMethodListItem {
    /**
     * Unique Id of the Customer Payment Method
     */
    id: number;
    /**
     * C = Credit Card (configuration dependent)
     */
    CategoryCode: string;
    /**
     * Visa
     */
    PaymentMethodCode: string;
    /**
     * Full description of the Payment Method
     */
    Description: string;
    /**
     * The name on the Credit Card or Bank Account
     */
    AccountName: string;
    /**
     * The Credit Card or Bank Account number
     */
    AccountNumber: string;
    /**
     * The expiry date of the Payment Method, usually only used for Credit Card type Payment Methods
     */
    ExpiryDate?: string;
    /**
     * Identifies the bank branch, only used for bank account Payment Methods
     */
    BSB?: string;
    /**
     * Code of the Status of the Payment Method
     */
    StatusCode: string;
    /**
     * CURRENT  - This is the active default payment method for the account REPLACED - This payment method was previously the default FUTURE   - This payment method is scheduled for future use OTHER    - This payment method is/was used by a connection on the account, but is not used as a default for the account 
     */
    Usage?: string;
    /**
     * The status of the Payment Method
     */
    Status: string;
    /**
     * Indicates the Account Number is Masked usually with some X characters
     */
    Masked: boolean;
    /**
     * Indicates the payment method has been used
     */
    Used?: boolean;
    /**
     * The last date and time the Payment Method was used.
     */
    LastUsedDateTime?: Date;
    /**
     * Indicates the payment method is the default payment method to be used by the Collection Manager
     */
    _default?: boolean;

    Default?: boolean;
    /**
     * Indicates the payment method is protectable. This means the Account Number can be masked
     */
    Protectable?: boolean;
    /**
     * Indicates the payment method has been protected
     */
    _protected?: boolean;
    /**
     * Indicates the payment method is exportable to an external gateway. The external gateway will return a Token and possibly a secondary Token.
     */
    Exportable?: boolean;
    /**
     * Indicates the payment method has been exported
     */
    Exported?: boolean;
    /**
     * Indicates the payment method is owned by the Customer. In some cases a Customer may use another persons Payment Method, typically a parent.
     */
    CustomerOwned?: boolean;
    /**
     * Token supplied by the external payment gateway when this Payment Method was registered with that payment gateway
     */
    Token?: string;
    /**
     * Secondary Token supplied by the external payment gateway when this Payment Method was registered with that payment gateway
     */
    SecondaryToken?: string;
    /**
     * Id of the Payment Method Usage record.
     */
    UsageId?: number;
    /**
     * The start datetime of the Usage record
     */
    UsageFromDateTime?: Date;
    /**
     * The end datetime of the Usage record. If on-going set to infinity.
     */
    UsageToDateTime?: Date;
    /**
     * The datetime the Payment Method was last updated.
     */
    LastUpdated?: Date;
    /**
     * The user who updated the Payment Method
     */
    UpdatedBy?: string;
}
