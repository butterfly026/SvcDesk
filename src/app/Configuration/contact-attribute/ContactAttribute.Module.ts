import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { ContactAttributeComponent } from './contact-attribute.component';
import { ContactAttributeConfigurationComponent } from './contact-attribute-configuration/contact-attribute-configuration.component';
import { ContactAttributeService } from './contact-attribute-configuration/services/contact-attribute-service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialShareModule,
        TranslaterModule,
        JQWidgetModule,
    ],
    exports: [
        ContactAttributeComponent,
        ContactAttributeConfigurationComponent,
    ],
    declarations: [
        ContactAttributeComponent,
        ContactAttributeConfigurationComponent,
    ],
    providers: [
        ContactAttributeService,
    ]
})
export class ContactAttributeModule {
}
