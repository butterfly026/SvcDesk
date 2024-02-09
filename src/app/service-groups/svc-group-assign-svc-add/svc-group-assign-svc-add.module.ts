import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SvcGroupAssignSvcAddPage } from './svc-group-assign-svc-add.page';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { AccountServiceGroupService } from 'src/app/account-service-groups/services/account-service-group.service';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: SvcGroupAssignSvcAddPage
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
  declarations: [SvcGroupAssignSvcAddPage],
  providers: [
    AccountServiceGroupService
  ]
})
export class SvcGroupAssignSvcAddPageModule { }
