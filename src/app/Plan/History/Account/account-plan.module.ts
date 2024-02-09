import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { MatDialogModule } from '@angular/material/dialog';
import { NgxCurrencyModule } from "ngx-currency";

import { SharedModule } from "src/app/Shared/shared.module";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { 
    AccountPlanComponent, 
    AccountPlanDetailComponent, 
    AccountPlanHistoryComponent, 
    AccountPlanNewComponent, 
    AttributeChargingComponent, 
    ChargesComponent, 
    DiscountsComponent, 
    GeneralPlanComponent, 
    PlanOptionsComponent, 
    UsageRatesComponent 
} from "./components";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
        PaginationModule,
        MatDialogModule,
        SharedModule,
        NgxCurrencyModule
    ],
    exports: [
        AccountPlanNewComponent,
        AccountPlanDetailComponent,     
        AccountPlanComponent,
        PlanOptionsComponent,
        AttributeChargingComponent,
        DiscountsComponent,
        GeneralPlanComponent,
        UsageRatesComponent,
        ChargesComponent
    ],
    declarations: [
        AccountPlanNewComponent,
        AccountPlanHistoryComponent,
        AccountPlanDetailComponent,
        AccountPlanComponent,
        PlanOptionsComponent,
        AttributeChargingComponent,
        DiscountsComponent,
        GeneralPlanComponent,
        UsageRatesComponent,
        ChargesComponent
    ],
    providers: []
})

export class AccountPlanModule { }