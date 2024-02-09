import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CustomerPaymentMethodListPage } from './customer-payment-method-list.page';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { TranslaterModule } from 'src/app/translater.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { CustomerPaymentMethodListService } from './services/customer-payment-method-list';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: CustomerPaymentMethodListPage
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
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [CustomerPaymentMethodListPage],
  providers: [
    CustomerPaymentMethodListService,
  ]
})
export class CustomerPaymentMethodListPageModule { }
