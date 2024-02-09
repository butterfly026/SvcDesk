import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SvcGroupSvcAssignmentHistoryPage } from './svc-group-svc-assignment-history.page';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { ServiceGroupServiceAssignListService } from './services/svc-group-svc-assign.service';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: SvcGroupSvcAssignmentHistoryPage
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
  declarations: [SvcGroupSvcAssignmentHistoryPage],
  providers: [
    ServiceGroupServiceAssignListService,
  ]
})
export class SvcGroupSvcAssignmentHistoryPageModule { }
