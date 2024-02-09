import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContactNewPage } from './contact-new.page';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { ContactNewModule } from './contact-new-component/ContactNew.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: ContactNewPage
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
    ContactNewModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ContactNewPage],
  providers: [
  ]
})
export class ContactNewPageModule { }
