import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { ContactEmailsService } from './services/contact-email.service';
import { ContactEmailComponentPage, ContactEmailHistoryPage } from './components';
import { SharedModule } from 'src/app/Shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
        SharedModule,
    ],
    exports: [
        ContactEmailComponentPage,
        ContactEmailHistoryPage,
    ],
    declarations: [
        ContactEmailComponentPage,
        ContactEmailHistoryPage,
    ],
    providers: [
        ContactEmailsService,
    ]
})
export class ContactEmailModule { }
