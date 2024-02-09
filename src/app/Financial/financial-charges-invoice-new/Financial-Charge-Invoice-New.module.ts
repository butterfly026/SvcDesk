import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { NgxCurrencyModule } from "ngx-currency";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { ChargeListComponent } from "./charge-list/charge-list.component";
import { ChargeNewComponent } from "./charge-new/charge-new.component";
import { FinancialChargesInvoiceNewComponent } from "./financial-charges-invoice-new.component";
import { SharedModule } from "src/app/Shared/shared.module";

@NgModule({
    imports: [
        IonicModule, 
        FormsModule, 
        CommonModule,
        TranslaterModule, 
        JQWidgetModule, 
        MaterialShareModule,
        NgxCurrencyModule, 
        PaginationModule,
        SharedModule
    ],
    declarations: [
        FinancialChargesInvoiceNewComponent,
        ChargeListComponent,
        ChargeNewComponent,
    ],
    exports: [
        FinancialChargesInvoiceNewComponent,
        ChargeListComponent,
        ChargeNewComponent,
    ]
})

export class FinancialChargesInvoiceNewModule { }