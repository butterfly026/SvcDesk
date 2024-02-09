import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ServiceGroupListPage } from './service-group-list.page';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { AccountServiceGroupModule } from 'src/app/account-service-groups/account-service-group.module';
import { AccountServiceGroupService } from 'src/app/account-service-groups/services/account-service-group.service';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: ServiceGroupListPage
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
    AccountServiceGroupModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [ServiceGroupListPage],
  providers: [
    AccountServiceGroupService
  ]
})
export class ServiceGroupListPageModule { }
