import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { PaginationModule } from 'src/app/component/paging-component/pagination.module';
import { ContactDocumentChildComponent } from './contact-document-child/contact-document-child.component';
import { ContactDocumentComponent } from './contact-document.component';
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
        ContactDocumentComponent,       
        ContactDocumentChildComponent        
    ],
    declarations: [ 
        ContactDocumentComponent,        
        ContactDocumentChildComponent       
    ],
    providers: []
})
export class ContactDocumentsModule { }
