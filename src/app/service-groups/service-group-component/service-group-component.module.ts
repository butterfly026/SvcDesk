import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ServiceGroupComponentPage } from './service-group-component.page';
import { AccountServiceGroupModule } from 'src/app/account-service-groups/account-service-group.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { TranslaterModule } from 'src/app/translater.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { ServiceLevelGroupModule } from 'src/app/service-group/service-level-group.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: ServiceGroupComponentPage
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
    AccountServiceGroupModule,
    ServiceLevelGroupModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [ServiceGroupComponentPage]
})
export class ServiceGroupComponentPageModule {}
