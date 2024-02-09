import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContactNewComponentPage } from './contact-new-component.page';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { ContactNewComponentService } from './services/contact-new-component.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
    ],
    exports: [
        ContactNewComponentPage,
    ],
    declarations: [ContactNewComponentPage],
    providers: [
        ContactNewComponentService,
    ]
})
export class ContactNewModule { }
