import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import {PaymentMethodsModule} from '../../../payment-methods/payment-methods.module'

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { ContactPaymentMethodComponentPage } from './contact-payment-method-component.page';
import { ContactPaymentMethodService } from './services/contact-payment-method.service';
import { TextMaskModule } from 'angular2-text-mask';
import { PaymentStatusHistoryPage } from './payment-status-history/payment-status-history.page';
import { PaymentDefaultUsagePage } from './payment-default-usage/payment-default-usage.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PaymentMethodsModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
        TextMaskModule
        
    ],
    exports: [
        ContactPaymentMethodComponentPage,
        PaymentStatusHistoryPage,
        PaymentDefaultUsagePage,
        PaymentMethodsModule,

    ],
    declarations: [
        ContactPaymentMethodComponentPage,
        PaymentStatusHistoryPage,
        PaymentDefaultUsagePage,
    ],
    providers: [
        ContactPaymentMethodService,
    ]
})
export class ContactPaymentMethodModule { }
