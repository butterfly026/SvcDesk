import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BusinessUnitSelectPage } from './business-unit-select.page';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { BusinessUnitService } from './services/business-unit-select.service';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: BusinessUnitSelectPage
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
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BusinessUnitSelectPage],
  providers: [
    BusinessUnitService,
  ]
})
export class BusinessUnitSelectPageModule { }
