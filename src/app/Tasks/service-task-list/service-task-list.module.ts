import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { ServiceTaskListComponent } from "./service-task-list/service-task-list.component";
import { SharedModule } from "src/app/Shared/shared.module";
@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        JQWidgetModule,
        MaterialShareModule,
        TranslaterModule,
        PaginationModule,
        SharedModule,
    ],
    declarations: [
        ServiceTaskListComponent,
    ],
    exports: [
        ServiceTaskListComponent,
    ]
})

export class ServiceTasksListModule { }