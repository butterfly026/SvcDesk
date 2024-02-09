import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RechargeSimpleNewPage } from './recharge-simple-new.page';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { TranslaterModule } from 'src/app/translater.module';
import { RechargeSimpleNewService } from './services/recharge-simple-new.service';
import { PaymentComponentModule } from 'src/app/Payment/customer-payment-method-list-uc-bus/payment-component/PaymentComponent.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: RechargeSimpleNewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialShareModule,
    JQWidgetModule,
    TranslaterModule,
    PaymentComponentModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [RechargeSimpleNewPage],
  providers: [
    RechargeSimpleNewService,
  ]
})
export class RechargeSimpleNewPageModule { }
