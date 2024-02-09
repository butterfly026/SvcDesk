import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BarServicePage } from './bar-service.page';
import { TranslaterModule } from 'src/app/translater.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { BarServiceService } from './services/bar-service.service';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: BarServicePage
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
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BarServicePage],
  providers: [
    BarServiceService
  ]
})
export class BarServicePageModule { }
