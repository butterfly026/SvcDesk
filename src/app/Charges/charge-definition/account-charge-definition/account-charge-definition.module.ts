import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { NgxCurrencyModule } from "ngx-currency";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { AccountChargeDefinitionComponent } from "./account-charge-definition.component";
import { ChargeDefinitionFormComponent } from "./charge-definition-form/charge-definition-form.component";
import { ChargeDefinitionListComponent } from "./charge-definition-list/charge-definition-list.component";
import { ChargeUsageFormComponent } from "./charge-usage/charge-usage-form/charge-usage-form.component";
import { ChargeUsageListComponent } from "./charge-usage/charge-usage-list/charge-usage-list.component";
import { ChargeUsageComponent } from "./charge-usage/charge-usage.component";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        MaterialShareModule,
        TranslaterModule,
        JQWidgetModule,
        NgxCurrencyModule,
        PaginationModule,
    ],
    exports: [
        AccountChargeDefinitionComponent,
        ChargeDefinitionFormComponent,
        ChargeDefinitionListComponent,
        ChargeUsageComponent,
        ChargeUsageListComponent,
        ChargeUsageFormComponent,
    ],
    declarations: [
        AccountChargeDefinitionComponent,
        ChargeDefinitionFormComponent,
        ChargeDefinitionListComponent,
        ChargeUsageComponent,
        ChargeUsageListComponent,
        ChargeUsageFormComponent,
    ]
})

export class AccountChargeDefinitionModule { }