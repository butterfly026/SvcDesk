import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { FinancialProductComponent } from "./financial-product.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { ProductNewComponent } from "./product-new/product-new.component";
import { SharedModule } from "src/app/Shared/shared.module";

@NgModule({
    imports: [
        IonicModule, 
        FormsModule, 
        CommonModule,
        JQWidgetModule, 
        MaterialShareModule, 
        TranslaterModule,
        SharedModule
    ],
    declarations: [
        ProductListComponent,
        ProductNewComponent,
        FinancialProductComponent,
    ],
    exports: [
        ProductListComponent,
        ProductNewComponent,
        FinancialProductComponent,
    ]
})

export class FinancialProductModule { }