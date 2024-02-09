import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { NgxCurrencyModule } from "ngx-currency";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { BillDisputesComponent } from "./bill-disputes.component";
import { DisputeListComponent } from "./dispute-list/dispute-list.component";
import { DisputeFormComponent } from "./dispute-form/dispute-form.component";
import { SharedModule } from "src/app/Shared/shared.module";
@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        TranslaterModule,
        MaterialShareModule,
        JQWidgetModule,
        PaginationModule,
        NgxCurrencyModule,
        SharedModule,
    ],
    exports: [
        BillDisputesComponent,
        DisputeListComponent,
        DisputeFormComponent,
    ],
    declarations: [
        BillDisputesComponent,
        DisputeListComponent,
        DisputeFormComponent,
    ]
})

export class BillDisputesAccountModule { }