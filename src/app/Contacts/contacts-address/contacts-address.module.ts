import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ContactsAddressPage } from './contacts-address.page';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { ContactsAddressComponentModule } from './contacts-address-component/contacts-address-component.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: ContactsAddressPage
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
    ContactsAddressComponentModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ContactsAddressPage]
})
export class ContactsAddressPageModule {}
