import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RechargeSimpleListPage } from './recharge-simple-list.page';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { RechargeSimpleListService } from './services/recharge-simple-list.service';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: RechargeSimpleListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialShareModule,
    TranslaterModule,
    JQWidgetModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [RechargeSimpleListPage],
  providers: [
    RechargeSimpleListService
  ]
})
export class RechargeSimpleListPageModule { }
