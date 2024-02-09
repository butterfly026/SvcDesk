import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { ContactsConfigurationService } from './services/contacts-configuration.service';
import { ContactsConfigurationComponent } from './contacts-configuration.component';
import { ConfigrationUpdateComponent } from './configration-update/configration-update.component';

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
        ContactsConfigurationComponent,
        ConfigrationUpdateComponent,
    ],
    declarations: [
        ContactsConfigurationComponent,
        ConfigrationUpdateComponent
    ],
    providers: [
        ContactsConfigurationService,
    ]
})
export class ContactsConfigurationModule { }
