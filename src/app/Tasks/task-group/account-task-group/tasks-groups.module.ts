import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { AccountTaskGroupComponent } from "./account-task-group.component";
import { TaskGroupFormComponent } from "./task-group-form/task-group-form.component";
import { TaskGroupListComponent } from "./task-group-list/task-group-list.component";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
    ],
    declarations: [
        AccountTaskGroupComponent,
        TaskGroupListComponent,
        TaskGroupFormComponent,
    ],
    exports: [
        AccountTaskGroupComponent,
        TaskGroupListComponent,
        TaskGroupFormComponent,
    ]
})

export class TasksGroupsModule { }