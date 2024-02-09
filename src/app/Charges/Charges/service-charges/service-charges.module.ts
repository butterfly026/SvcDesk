import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { ChargeDetailComponent } from "./charge-detail/charge-detail.component";
import { ChargeDetailService } from "./charge-detail/services/charge-detail.service";
import { ChargeFormComponent } from "./charge-form/charge-form.component";
import { ChargeFormService } from "./charge-form/services/charge-form.service";
import { ChargeListComponent } from "./charge-list/charge-list.component";
import { ChargeListService } from "./charge-list/services/charge-list.service";
import { ServiceChargesComponent } from "./service-charges.component";
import { NgxCurrencyModule } from "ngx-currency";
import { SharedModule } from "src/app/Shared/shared.module";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslaterModule,
        MaterialShareModule,
        JQWidgetModule,
        PaginationModule,
        NgxCurrencyModule,
        SharedModule,
    ],
    exports: [
        ServiceChargesComponent,
        ChargeFormComponent,
        ChargeListComponent,
        ChargeDetailComponent,
    ],
    declarations: [
        ServiceChargesComponent,
        ChargeFormComponent,
        ChargeListComponent,
        ChargeDetailComponent,
    ],
    providers: [
        ChargeListService,
        ChargeFormService,
        ChargeDetailService,
    ]
})

export class ServiceChargesModule { }