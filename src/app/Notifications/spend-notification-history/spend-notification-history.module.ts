import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SpendNotificationHistoryPage } from './spend-notification-history.page';
import { TranslaterModule } from 'src/app/translater.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { SpendNotificationHistoryService } from './services/spend-notification-history.service';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: SpendNotificationHistoryPage
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
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [SpendNotificationHistoryPage],
  providers: [
    SpendNotificationHistoryService,
  ]
})
export class SpendNotificationHistoryPageModule { }
