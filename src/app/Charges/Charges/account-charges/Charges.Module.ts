import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ChargeInstancesComponent } from "./charge-instances/charge-instances.component";
import { ChargeInstancesService } from "./charge-instances/services/charge-instances.service";
import { ChargeListComponent } from "./charge-list/charge-list.component";
import { ChargeListService } from "./charge-list/services/charge-list-service";
import { ChargeNewComponent } from "./charge-new/charge-new.component";
import { ChargeNewService } from "./charge-new/services/charge-new-service";
import { ChargeUpdateComponent } from "./charge-update/charge-update.component";
import { ChargeUpdateService } from "./charge-update/services/charge-update-service";
import { ChargesComponent } from "./charges.component";
import { NgxCurrencyModule } from "ngx-currency";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { SharedModule } from "src/app/Shared/shared.module";
import { ChargeDetailComponent } from "./charge-detail/charge-detail.component";

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
        ChargesComponent,
        ChargeListComponent,
        ChargeNewComponent,
        ChargeUpdateComponent,
        ChargeInstancesComponent,
    ],
    declarations: [
        ChargesComponent,
        ChargeListComponent,
        ChargeNewComponent,
        ChargeUpdateComponent,
        ChargeInstancesComponent,
        ChargeDetailComponent
    ],
    providers: [
        ChargeListService,
        ChargeNewService,
        ChargeUpdateService,
        ChargeInstancesService,
    ]
})

export class AccountChargesModule { }