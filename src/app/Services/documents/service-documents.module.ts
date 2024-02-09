import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';

import { ServiceDocumentComponent } from './service-document.component';
import { PaginationModule } from 'src/app/component/paging-component/pagination.module';
import { ServiceDocumentChildComponent } from './service-document-child/service-document-child.component';
import { SharedModule } from 'src/app/Shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
        PaginationModule,
        SharedModule,
    ],
    exports: [
        ServiceDocumentComponent,       
        ServiceDocumentChildComponent,
    ],
    declarations: [
       
        ServiceDocumentComponent,       
        ServiceDocumentChildComponent,
    ],
    providers: []
})
export class ServiceDocumentsModule { }
