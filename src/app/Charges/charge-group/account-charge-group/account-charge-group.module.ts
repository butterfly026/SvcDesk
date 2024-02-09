import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { AccountChargeGroupComponent } from "./account-charge-group.component";
import { ChargeGroupFormComponent } from "./charge-group-form/charge-group-form.component";
import { ChargeGroupListComponent } from "./charge-group-list/charge-group-list.component";

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
        AccountChargeGroupComponent,
        ChargeGroupListComponent,
        ChargeGroupFormComponent,
    ],
    exports: [
        AccountChargeGroupComponent,
        ChargeGroupListComponent,
        ChargeGroupFormComponent,
    ]
})

export class AccountChargeGroupModule { }