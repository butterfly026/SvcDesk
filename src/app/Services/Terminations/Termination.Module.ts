import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { TerminationChangeDateService } from "./termination-change-date/services/termination-change-date-service";
import { TerminationChangeDateComponent } from "./termination-change-date/termination-change-date.component";
import { TerminationDetailService } from "./termination-detail/services/termination-detail-service";
import { TerminationDetailComponent } from "./termination-detail/termination-detail.component";
import { TerminationReceiveService } from "./termination-receive/services/termination-receive-service";
import { TerminationReceiveComponent } from "./termination-receive/termination-receive.component";
import { TerminationReverseService } from "./termination-reverse/services/termination-reverse-service";
import { TerminationReverseComponent } from "./termination-reverse/termination-reverse.component";
import { TerminationService } from "./termination-service/services/termination-service.service";
import { TerminationServiceComponent } from "./termination-service/termination-service.component";
import { TerminationsComponent } from "./terminations.component";
import { NgxCurrencyModule } from "ngx-currency";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
        PaginationModule,
        NgxCurrencyModule
    ],
    exports: [
        TerminationChangeDateComponent,
        TerminationDetailComponent,
        TerminationReceiveComponent,
        TerminationReverseComponent,
        TerminationServiceComponent,
        TerminationsComponent,
    ],
    declarations: [
        TerminationChangeDateComponent,
        TerminationDetailComponent,
        TerminationReceiveComponent,
        TerminationReverseComponent,
        TerminationServiceComponent,
        TerminationsComponent,
    ],
    providers: [
        TerminationChangeDateService,
        TerminationDetailService,
        TerminationReceiveService,
        TerminationReverseService,
        TerminationService,
    ]
})

export class TerminationsModule { }