import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContactsAliasesPage } from './contacts-aliases.page';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { ContactsAliasesComponentModule } from './contacts-aliases-component/contacts-aliases-component.module';
import { TranslaterModule } from 'src/app/translater.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: ContactsAliasesPage
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
    ContactsAliasesComponentModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ContactsAliasesPage]
})
export class ContactsAliasesPageModule { }
