import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoyaltyHomePage } from './loyalty-home.page';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: LoyaltyHomePage
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
    LoyaltyModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [LoyaltyHomePage]
})
export class LoyaltyHomePageModule { }
