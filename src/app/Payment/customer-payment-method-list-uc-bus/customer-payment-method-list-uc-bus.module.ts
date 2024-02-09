import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CustomerPaymentMethodListUcBusPage } from './customer-payment-method-list-uc-bus.page';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TextMaskModule } from 'angular2-text-mask';
import { PaymentComponentModule } from './payment-component/PaymentComponent.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: CustomerPaymentMethodListUcBusPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslaterModule,
    JQWidgetModule,
    MaterialShareModule,
    TextMaskModule,
    PaymentComponentModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [CustomerPaymentMethodListUcBusPage]
})
export class CustomerPaymentMethodListUcBusPageModule { }
