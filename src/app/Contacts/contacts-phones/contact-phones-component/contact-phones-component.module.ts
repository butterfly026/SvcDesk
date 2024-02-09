import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { ContactPhoneHistoryPage } from './components/contact-phone-history/contact-phone-history.page';
import { ContactPhoneComponentPage } from './components';
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
        ContactPhoneComponentPage,
        ContactPhoneHistoryPage,
    ],
    declarations: [
        ContactPhoneComponentPage,
        ContactPhoneHistoryPage,
    ],
    providers: []
})
export class ContactsPhoneComponentModule { }
