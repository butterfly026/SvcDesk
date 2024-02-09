import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BulkDisconnectPage } from './bulk-disconnect.page';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { TranslaterModule } from 'src/app/translater.module';
import { BulkDisconnectService } from './services/bulk-disconnect.service';
import { BulkChangeServiceSelectionPage } from '../bulk-change-service-selection/bulk-change-service-selection.page';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: BulkDisconnectPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialShareModule,
    JQWidgetModule,
    TranslaterModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [
    BulkDisconnectPage,
    BulkChangeServiceSelectionPage,
  ],
  exports: [
    BulkChangeServiceSelectionPage
  ],
  providers: [
    BulkDisconnectService
  ]
})
export class BulkDisconnectPageModule { }
