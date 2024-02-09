import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { ChargesComponentPage } from './charges-component.page';
import { ChargesService } from './services/charges.service';
import { ChargesNewPage } from './charges-new/charges-new.page';
import { ChargesUpdatePage } from './charges-update/charges-update.page';

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
        ChargesComponentPage,
        ChargesNewPage,
        ChargesUpdatePage,
    ],
    declarations: [
        ChargesComponentPage,
        ChargesNewPage,
        ChargesUpdatePage,
    ],
    providers: [
        ChargesService,
    ]
})
export class ContactsChargesModule { }
