import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { PortalMenuComponent } from './portal-menu.component';
import { PortalMenuService } from './services/portal-menu.service';

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
        PortalMenuComponent
    ],
    declarations: [
        PortalMenuComponent
    ],
    providers: [
        PortalMenuService
    ]
})
export class PortalMenuModule { }
