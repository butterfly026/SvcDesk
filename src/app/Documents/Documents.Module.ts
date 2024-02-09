import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';

import { PaginationModule } from 'src/app/component/paging-component/pagination.module';
import { AdminDocumentComponent } from './admin-document/admin-document.component';
import { DocumentComponent } from './admin-document/document/document.component';
import { DocumentService } from './admin-document/document/services/document-service';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
        PaginationModule,
    ],
    exports: [
        AdminDocumentComponent,
        DocumentComponent      
    ],
    declarations: [
        AdminDocumentComponent,
        DocumentComponent,
     
    ],
    providers: []
})
export class DocumentsModule { }
