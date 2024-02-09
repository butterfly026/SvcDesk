import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { DocumentsAddComponent } from "./documents-add/documents-add.component";
import { DocumentsAddService } from "./documents-add/services/documents-add.service";
import { DocumentsOwnListComponent } from "./documents-own-list/documents-own-list.component";
import { DocumentsOwnService } from "./documents-own-list/services/documents-own.service";
import { DocumentsPublicListComponent } from "./documents-public-list/documents-public-list.component";
import { DocumentsPublicService } from "./documents-public-list/services/document-public.service";
import { DocumentsComponent } from "./documents.component";

@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
        PaginationModule,
    ],
    exports: [
        DocumentsComponent,
        DocumentsAddComponent,
        DocumentsOwnListComponent,
        DocumentsPublicListComponent,
    ],
    declarations: [
        DocumentsComponent,
        DocumentsAddComponent,
        DocumentsOwnListComponent,
        DocumentsPublicListComponent,
    ],
    providers: [
        DocumentsAddService,
        DocumentsOwnService,
        DocumentsPublicService,
    ]
})

export class DocumentsModule { }