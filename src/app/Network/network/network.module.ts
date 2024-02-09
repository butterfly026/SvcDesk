import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { NetworkDetailPage } from './network-detail/network-detail.page';
import { from } from 'rxjs';
import { NetworkPage } from './network.page';

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
        NetworkPage,
        NetworkDetailPage,
    ],
    declarations: [
        NetworkPage,
        NetworkDetailPage,
    ],
    providers: []
})
export class NetworkModule { }
