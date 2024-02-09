import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SvcGroupSvcBarPage } from './svc-group-svc-bar.page';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { ServiceGroupServiceBarService } from './services/svc-group-svc-bar.service';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: SvcGroupSvcBarPage
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
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [SvcGroupSvcBarPage],
  providers: [
    ServiceGroupServiceBarService
  ]
})
export class SvcGroupSvcBarPageModule { }
