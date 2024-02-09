import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { NgxCurrencyModule } from "ngx-currency";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { FinancialProductNewComponent } from "./financial-product-new.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductNewComponent } from "./product-new/product-new.component";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
        PaginationModule,
        NgxCurrencyModule
    ],
    exports: [
        FinancialProductNewComponent,
        ProductListComponent,
        ProductNewComponent,
    ],
    declarations: [
        FinancialProductNewComponent,
        ProductListComponent,
        ProductNewComponent,
    ]
})

export class FinancialProductNewModule { }