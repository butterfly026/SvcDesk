import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DiscountListPage } from './discount-list.page';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { DiscountListService } from './services/discount-list.service';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: DiscountListPage
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
    RouterModule.forChild(routes),
    ComponentsModule,
  ],
  declarations: [DiscountListPage],
  providers: [
    DiscountListService,
  ]
})
export class DiscountListPageModule { }
