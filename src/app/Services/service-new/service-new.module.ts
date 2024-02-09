import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";;
import { CdkStepper } from "@angular/cdk/stepper";
import { NgxCurrencyModule } from "ngx-currency";

import { SharedModule } from "src/app/Shared/shared.module";
import { ServicePlanModule } from "src/app/Plan/History/Service/service-plan.module";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { TranslaterModule } from "src/app/translater.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import {
    ServiceNewMainComponent,
    ServiceTypeComponent,
    ServiceNewLeftMenuComponent,
    ServiceNewPlanComponent,
    ServiceNewAttributesComponent,
    ServiceNewPlanDetailComponent,
    ServiceNewAddressesComponent,
    ServiceNewPortingComponent,
    ServiceNewAttributesElementComponent,
} from "./components";

@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        TranslaterModule,
        PaginationModule,
        MaterialShareModule,
        JQWidgetModule,
        ServicePlanModule,
        NgxCurrencyModule,
        SharedModule,
    ],
    exports: [
        ServiceNewMainComponent,
        ServiceTypeComponent
    ],
    declarations: [
        ServiceNewMainComponent,
        ServiceTypeComponent,
        ServiceNewAttributesComponent,
        ServiceNewLeftMenuComponent,
        ServiceNewPlanComponent,
        ServiceNewPlanDetailComponent,
        ServiceNewAddressesComponent,
        ServiceNewPortingComponent,
        ServiceNewAttributesElementComponent
    ],
    providers: [
        { provide: CdkStepper, useValue: {} }
    ]
})

export class ServiceNewModule { }