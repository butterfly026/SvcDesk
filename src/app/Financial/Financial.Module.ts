import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ComponentsModule } from "../component/components.module";
import { PaginationModule } from "../component/paging-component/pagination.module";
import { JQWidgetModule } from "../jqWidet.module";
import { MaterialShareModule } from "../materialshare.module";
import { TranslaterModule } from "../translater.module";
import { FinancialAllocationsComponent } from "./financial-allocations/financial-allocations.component";
import { FinancialDistributionsComponent } from "./financial-distributions/financial-distributions.component";
import { FinancialEventsComponent } from "./financial-events/financial-events.component";
import { FinancialExternalTransactionsComponent } from "./financial-external-transactions/financial-external-transactions.component";
import { FinancialInvoiceFormComponent } from "./financial-invoice-form/financial-invoice-form.component";
import { FinancialInvoiceFormService } from "./financial-invoice-form/services/financial-invoice-form.service";
import { FinancialPayRequestsComponent } from "./financial-pay-requests/financial-pay-requests.component";
import { FinancialServiceSummaryComponent } from "./financial-service-summary/financial-service-summary.component";
import { FinancialSplitsComponent } from "./financial-splits/financial-splits.component";
import { FinancialTransactionDetailPage } from "./financial-transaction-detail/financial-transaction-detail.page";
import { FinancialTransactionDetailService } from "./financial-transaction-detail/services/financial-transaction-detail.service";
import { FinancialUsageHistoryComponent } from "./financial-usage-history/financial-usage-history.component";
import { FinancialUsageHistoryService } from "./financial-usage-history/services/financial-usage-history-service";
import { FinancialUsageComponent } from "./financial-usage/financial-usage.component";
import { FinancialUsageService } from "./financial-usage/service/financial-usage-service";
import { FinancialTransactionListPage } from "./financial-transaction-list/financial-transaction-list.page";
import { FinancialTransactionListService } from "./financial-transaction-list/services/transaction-list.service";
import { ReceiptPage } from "./receipt/receipt.page";
import { NgxCurrencyModule } from "ngx-currency";
import { PaymentMethodModule } from "../Payment/payment.module";
import { FinancialChargesModule } from "./financial-charges/financial-charge.module";
import { FinancialProductModule } from "./financial-product/financial-product.module";
import { FinancialChargesInvoiceNewModule } from "./financial-charges-invoice-new/Financial-Charge-Invoice-New.module";
import { FinancialProductNewModule } from "./financial-product-new/financial-product-new.module";
import { PaymentMethodsModule } from "../payment-methods/payment-methods.module";
import { SharedModule } from "../Shared/shared.module";
import { ReceiptAllocationComponent, ReceiptAllocationEditComponent } from "./receipt/components";
import { FinancialCreditAdjustmentComponent } from "./financial-credit-adjustment/financial-credit-adjustment.component";
import { FinancialDebitAdjustmentComponent } from "./financial-debit-adjustment/financial-debit-adjustment.component";
import { FinancialAutoAllocateAllComponent } from "./financial-auto-allocate-all/financial-auto-allocate-all.component";
import { FinancialTransactionEditStatusComponent } from "./financial-transaction-edit-status/financial-transaction-edit-status.component";
import { FinancialTransactionReallocateComponent } from "./financial-transaction-reallocate/financial-transaction-reallocate.component";


@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        TranslaterModule,
        MaterialShareModule,
        JQWidgetModule,
        ComponentsModule,
        PaginationModule,
        NgxCurrencyModule,
        PaymentMethodModule,
        FinancialChargesModule,
        FinancialProductModule,
        FinancialChargesInvoiceNewModule,
        FinancialProductNewModule,
        PaymentMethodsModule,
        SharedModule
    ],
    exports: [
        FinancialTransactionDetailPage,
        FinancialTransactionListPage,
        ReceiptPage,
        FinancialAllocationsComponent,
        FinancialDistributionsComponent,
        FinancialSplitsComponent,
        FinancialEventsComponent,
        FinancialExternalTransactionsComponent,
        FinancialServiceSummaryComponent,
        FinancialPayRequestsComponent,
        FinancialUsageComponent,
        FinancialUsageHistoryComponent,
        FinancialInvoiceFormComponent,
        FinancialCreditAdjustmentComponent,
        FinancialDebitAdjustmentComponent,
        FinancialAutoAllocateAllComponent,
        FinancialTransactionReallocateComponent
    ],
    declarations: [
        FinancialTransactionDetailPage,
        FinancialTransactionListPage,
        ReceiptPage,
        ReceiptAllocationComponent,
        ReceiptAllocationEditComponent,
        FinancialAllocationsComponent,
        FinancialDistributionsComponent,
        FinancialSplitsComponent,
        FinancialEventsComponent,
        FinancialExternalTransactionsComponent,
        FinancialServiceSummaryComponent,
        FinancialPayRequestsComponent,
        FinancialUsageComponent,
        FinancialUsageHistoryComponent,
        FinancialInvoiceFormComponent,
        FinancialCreditAdjustmentComponent,
        FinancialDebitAdjustmentComponent,
        FinancialAutoAllocateAllComponent,
        FinancialTransactionEditStatusComponent,
        FinancialTransactionReallocateComponent
    ],
    providers: [
        FinancialTransactionListService,
        FinancialTransactionDetailService,
        FinancialUsageService,
        FinancialUsageHistoryService,
        FinancialInvoiceFormService,
    ]

})

export class FinancialModule { }