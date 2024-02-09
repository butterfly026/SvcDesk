import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SvcSvcGroupAssignmentHistoryPage } from './svc-svc-group-assignment-history.page';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { ServiceAddPage } from './service-add/service-add.page';
import { ServiceGroupAssignedListPage } from './service-group-assigned-list/service-group-assigned-list.page';
import { ServiceGroupUnassignedListPage } from './service-group-unassigned-list/service-group-unassigned-list.page';
import { AccountServiceGroupService } from 'src/app/account-service-groups/services/account-service-group.service';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: SvcSvcGroupAssignmentHistoryPage
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
    ComponentsModule
  ],
  declarations: [
    SvcSvcGroupAssignmentHistoryPage,
    ServiceGroupAssignedListPage,
    ServiceGroupUnassignedListPage,
  ],
  providers: [
    AccountServiceGroupService,
  ]
})
export class SvcSvcGroupAssignmentHistoryPageModule { }
