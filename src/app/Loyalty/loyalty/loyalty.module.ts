import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { LoyaltyPage } from './loyalty.page';
import { LoyaltyDetailPage } from './loyalty-detail/loyalty-detail.page';

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
        LoyaltyPage,
        LoyaltyDetailPage,
    ],
    declarations: [
        LoyaltyPage,
        LoyaltyDetailPage,
    ],
    providers: []
})
export class LoyaltyModule { }
