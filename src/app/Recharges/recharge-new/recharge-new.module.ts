import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RechargeNewPage } from './recharge-new.page';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { RechargeNewService } from './services/recharge-new.service';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: RechargeNewPage
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
  declarations: [RechargeNewPage],
  providers: [
    RechargeNewService
  ]
})
export class RechargeNewPageModule { }
