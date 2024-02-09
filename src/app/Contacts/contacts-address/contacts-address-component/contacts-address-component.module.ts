import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { ContactsAddressService } from './services/contacts-address.service';
import { ContactsAddressComponentPage, ContactsAddressHistoryPage } from './components';
import { SharedModule } from 'src/app/Shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
        SharedModule
    ],
    exports: [
        ContactsAddressComponentPage,
        ContactsAddressHistoryPage,
    ],
    declarations: [
        ContactsAddressComponentPage,
        ContactsAddressHistoryPage,
    ],
    providers: [
        ContactsAddressService,
    ]
})
export class ContactsAddressComponentModule { }
