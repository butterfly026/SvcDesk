import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { ServiceAttributeService } from './service-attribute-configuration/services/service-attribute-service';
import { ServiceAttributeComponent } from './service-attribute.component';
import { ServiceAttributeConfigurationComponent } from './service-attribute-configuration/service-attribute-configuration.component';

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
        ServiceAttributeComponent,
        ServiceAttributeConfigurationComponent,
    ],
    declarations: [
        ServiceAttributeComponent,
        ServiceAttributeConfigurationComponent,
    ],
    providers: [
        ServiceAttributeService,
    ]
})
export class ServiceAttributeModule {
}
