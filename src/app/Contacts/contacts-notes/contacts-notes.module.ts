import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContactsNotesPage } from './contacts-notes.page';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { ContactsNotesModule } from './contacts-notes-component/contacts-notes.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: ContactsNotesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslaterModule,
    MaterialShareModule,
    JQWidgetModule,
    ContactsNotesModule,
    RouterModule.forChild(routes),
    ComponentsModule,
  ],
  declarations: [ContactsNotesPage]
})
export class ContactsNotesPageModule { }
