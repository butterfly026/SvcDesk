import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OeHomePage } from './oe-home.page';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { OrderEntryModule } from '../../Order-Entry/OrderEntry.module';
import { OrderManagementModule } from '../../OE-Management/OrderManagement.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: OeHomePage
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
    OrderEntryModule,
    OrderManagementModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [OeHomePage]
})
export class OeHomePageModule { }
