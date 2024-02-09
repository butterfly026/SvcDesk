import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { AccountChargeOverrideFormComponent } from "./account-charge-override/account-charge-override-form/account-charge-override-form.component";
import { AccountChargeOverrideListComponent } from "./account-charge-override/account-charge-override-list/account-charge-override-list.component";
import { AccountChargeOverrideComponent } from "./account-charge-override/account-charge-override.component";
import { AccountService } from "./account-charge-override/services/account-service";
import { ServiceFormComponent } from "./service/service-form/service-form.component";
import { ServiceListComponent } from "./service/service-list/service-list.component";
import { ServiceComponent } from "./service/service.component";
import { NgxCurrencyModule } from "ngx-currency";
import { ServiceChargeOverrideService } from "./service/services/service.service";
import { SharedModule } from "src/app/Shared/shared.module";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
        NgxCurrencyModule,
        PaginationModule,
        SharedModule,
    ],
    exports: [
        AccountChargeOverrideComponent,
        AccountChargeOverrideListComponent,
        AccountChargeOverrideFormComponent,
        ServiceComponent,
        ServiceListComponent,
        ServiceFormComponent,
    ],
    declarations: [
        AccountChargeOverrideComponent,
        AccountChargeOverrideListComponent,
        AccountChargeOverrideFormComponent,
        ServiceComponent,
        ServiceListComponent,
        ServiceFormComponent,
    ],
    providers: [
        AccountService,
        ServiceChargeOverrideService,
    ]
})

export class ChargeOverrideModule { }