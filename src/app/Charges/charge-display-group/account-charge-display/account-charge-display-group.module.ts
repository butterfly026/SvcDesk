import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { AccountChargeDisplayComponent } from "./account-charge-display.component";
import { ChargeDisplayFormComponent } from "./charge-display-form/charge-display-form.component";
import { ChargeDisplayListComponent } from "./charge-display-list/charge-display-list.component";

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
        AccountChargeDisplayComponent,
        ChargeDisplayListComponent,
        ChargeDisplayFormComponent,
    ],
    exports: [
        AccountChargeDisplayComponent,
        ChargeDisplayListComponent,
        ChargeDisplayFormComponent,
    ]
})

export class AccountChargeDisplayGroupModule { }