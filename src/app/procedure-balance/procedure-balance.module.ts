import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProcedureBalancePage } from './procedure-balance.page';
import { TranslaterModule } from '../translater.module';
import { MaterialShareModule } from '../materialshare.module';
import { JQWidgetModule } from '../jqWidet.module';
import { ProcedureBalanceService } from './services/procedure-balance.service';
import { ComponentsModule } from '../component/components.module';

const routes: Routes = [
  {
    path: '',
    component: ProcedureBalancePage
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
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [ProcedureBalancePage],
  providers: [
    ProcedureBalanceService,
  ]
})
export class ProcedureBalancePageModule { }
