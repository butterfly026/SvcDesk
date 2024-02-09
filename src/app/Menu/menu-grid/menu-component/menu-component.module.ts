import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { MenuComponentComponent } from './menu-component.component';
import { MenuComponentService } from './services/menu-component.service';

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
        MenuComponentComponent
    ],
    declarations: [
        MenuComponentComponent
    ],
    providers: [
        MenuComponentService,
    ]
})
export class MenuComponentModule { }
