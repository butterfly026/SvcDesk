export interface TransactionComponent {
    Id: number,
    Name: string,
    Type: string,
    Amount: string,
    DiscountId: string,
    Discount: string,
    TransactionCategory: string,
    Tariff: string,
    PlanId: string,
    OverrideId: string,
    Taxable: boolean
}