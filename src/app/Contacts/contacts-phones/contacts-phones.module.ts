import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContactsPhonesPage } from './contacts-phones.page';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { ContactsPhoneComponentModule } from './contact-phones-component/contact-phones-component.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: ContactsPhonesPage
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
    ContactsPhoneComponentModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ],
  declarations: [ContactsPhonesPage],
  providers: [
  ]
})
export class ContactsPhonesPageModule { }
