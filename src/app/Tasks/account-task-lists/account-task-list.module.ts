import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { CKEditorModule } from "ckeditor4-angular";
import { AccountTaskListComponent } from "./account-task-list/account-task-list.component";
import { AccountTaskNewComponent } from "./account-task-new/account-task-new.component";
import { AccountTaskDocumentNewComponent } from "./account-task-document-new/account-task-document-new.component";
import { AccountTaskDocumentListComponent } from "./account-task-document-list/account-task-document-list.component";
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
        CKEditorModule,
        SharedModule
    ],
    declarations: [
        AccountTaskListComponent,
        AccountTaskNewComponent,
        AccountTaskDocumentNewComponent,
        AccountTaskDocumentListComponent,
    ],
    exports: [
        AccountTaskListComponent,
        AccountTaskNewComponent,
        AccountTaskDocumentNewComponent,
        AccountTaskDocumentListComponent,
    ]
})

export class AccountTasksListModule { }