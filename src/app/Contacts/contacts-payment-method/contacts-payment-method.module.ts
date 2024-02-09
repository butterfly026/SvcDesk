import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContactsPaymentMethodPage } from './contacts-payment-method.page';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { TranslaterModule } from 'src/app/translater.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { ContactPaymentMethodModule } from './contact-payment-method-component/ContactPaymentMethod.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: ContactsPaymentMethodPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JQWidgetModule,
    MaterialShareModule,
    TranslaterModule,
    ContactPaymentMethodModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ],
  declarations: [ContactsPaymentMethodPage]
})
export class ContactsPaymentMethodPageModule { }
