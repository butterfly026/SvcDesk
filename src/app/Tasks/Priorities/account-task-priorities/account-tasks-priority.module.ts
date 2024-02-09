import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { AccountTaskPrioritiesComponent } from "./account-task-priorities.component";
import { TaskPriorityFormComponent } from "./task-priority-form/task-priority-form.component";
import { TaskPriorityListComponent } from "./task-priority-list/task-priority-list.component";

@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
    ],
    exports: [
        AccountTaskPrioritiesComponent,
        TaskPriorityListComponent,
        TaskPriorityFormComponent,
    ],
    declarations: [
        AccountTaskPrioritiesComponent,
        TaskPriorityListComponent,
        TaskPriorityFormComponent,
    ]
})

export class AccountTaskPriorityModule { }