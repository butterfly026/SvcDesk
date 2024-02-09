import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PaginationModule } from "../component/paging-component/pagination.module";
import { JQWidgetModule } from "../jqWidet.module";
import { MaterialShareModule } from "../materialshare.module";
import { TranslaterModule } from "../translater.module";
import { CommissionDetailComponent } from "./commission-detail/commission-detail.component";
import { CommissionFilterComponent } from "./commission-filter/commission-filter.component";
import { CommissionListComponent } from "./commission-list/commission-list.component";
import { CommissionManagementComponent } from "./commission-management/commission-management.component";
import { CommissionPaidTransactionComponent } from "./commission-paid-transaction/commission-paid-transaction.component";
import { InputDisableControlDirective } from "./directives/input-disable-directive";
import { ResponsiveGridDirective } from "./directives/responsive-grid-directive";
import { PayCommissionComponent } from "./pay-commission/pay-commission.component";
import { SearchPipe } from "./pipes/service-pipe";
import { TagCommissionComponent } from "./tag-commission/tag-commission.component";
import { UnTagCommissionComponent } from "./un-tag-commission/un-tag-commission.component";
import { UpdateCommissionPaymentComponent } from "./update-commission-payment/update-commission-payment.component";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
        PaginationModule,
    ],
    declarations: [
        CommissionDetailComponent,
        CommissionListComponent,
        CommissionPaidTransactionComponent,
        CommissionManagementComponent,
        PayCommissionComponent,
        TagCommissionComponent,
        UnTagCommissionComponent,
        UpdateCommissionPaymentComponent,
        CommissionManagementComponent,
        CommissionFilterComponent,
        ResponsiveGridDirective,
        InputDisableControlDirective,
        SearchPipe,
    ],
    exports: [
        CommissionDetailComponent,
        CommissionListComponent,
        CommissionPaidTransactionComponent,
        CommissionManagementComponent,
        PayCommissionComponent,
        TagCommissionComponent,
        UnTagCommissionComponent,
        UpdateCommissionPaymentComponent,
        CommissionManagementComponent,
        CommissionFilterComponent,
    ],
    providers: [
    ]
})

export class CommissionsModule { }