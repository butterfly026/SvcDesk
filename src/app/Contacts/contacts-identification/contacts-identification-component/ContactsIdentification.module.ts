import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { ContactsIdentificationService } from './services/contacts-identification.service';
import { ContactsIdentificationComponentPage } from './contacts-identification-component.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
    ],
    exports: [
        ContactsIdentificationComponentPage
    ],
    declarations: [
        ContactsIdentificationComponentPage
    ],
    providers: [
        ContactsIdentificationService,
    ]
})
export class ContactsIdentificationModule { }
