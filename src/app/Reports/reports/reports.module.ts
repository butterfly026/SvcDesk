import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { SharedModule } from "src/app/Shared/shared.module";
import { ReportsInstancesComponent, ReportsInstancesViewComponent, ReportsListComponent, ReportsRunNowComponent, ReportsScheduledsComponent, ReportsRunScehduleComponent } from "./components";
import { SelectDateDirective } from "./directives";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        MaterialShareModule,
        TranslaterModule,
        JQWidgetModule,
        PaginationModule,
        SharedModule,
    ],
    exports: [
        ReportsListComponent,
        ReportsRunScehduleComponent,
        ReportsScheduledsComponent,
        ReportsInstancesComponent,
        ReportsInstancesViewComponent,
        ReportsRunNowComponent,
    ],
    declarations: [
        ReportsListComponent,
        ReportsRunScehduleComponent,
        ReportsScheduledsComponent,
        ReportsInstancesComponent,
        ReportsInstancesViewComponent,
        ReportsRunNowComponent,
        SelectDateDirective,
    ],
    providers: []
})

export class ReportsModule { }