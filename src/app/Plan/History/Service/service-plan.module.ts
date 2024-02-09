import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { NgxCurrencyModule } from "ngx-currency";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { SharedModule } from "src/app/Shared/shared.module";
import {
    AttributeChargingComponent, 
    ChargesComponent, 
    DiscountsComponent, 
    GeneralPlanComponent, 
    PlanHistoryComponent, 
    PlanNewComponent, 
    PlanOptionsComponent, 
    ServicePlanComponent, 
    ServicePlanDetailComponent, 
    UsageRatesComponent
} from "src/app/Plan/History/Service/components";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        NgxCurrencyModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
        PaginationModule,
        SharedModule
    ],
    exports: [
        PlanHistoryComponent,
        ServicePlanDetailComponent,       
        PlanNewComponent,
        ServicePlanComponent,

        AttributeChargingComponent,
        DiscountsComponent,
        GeneralPlanComponent,
        UsageRatesComponent,
        PlanOptionsComponent,
        ChargesComponent,
    ],
    declarations: [
        PlanHistoryComponent,
        ServicePlanDetailComponent,    
        PlanNewComponent,
        ServicePlanComponent,
        AttributeChargingComponent,
        DiscountsComponent,
        GeneralPlanComponent,
        UsageRatesComponent,
        PlanOptionsComponent,
        ChargesComponent,
    ],
    providers: []
})

export class ServicePlanModule { }