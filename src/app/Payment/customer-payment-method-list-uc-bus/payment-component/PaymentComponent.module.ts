import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { TextMaskModule } from 'angular2-text-mask';
import { PaymentComponentPage } from './payment-component.page';
import { PaymentComponentService } from './services/payment-component.service';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TextMaskModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
    ],
    exports: [
        PaymentComponentPage,
    ],
    declarations: [
        PaymentComponentPage,
    ],
    providers: [
        PaymentComponentService,
    ]
})
export class PaymentComponentModule { }
