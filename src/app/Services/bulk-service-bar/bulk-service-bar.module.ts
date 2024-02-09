import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BulkServiceBarPage } from './bulk-service-bar.page';
import { BulkServiceBarService } from './services/bulk-service-bar.service';
import { TranslaterModule } from 'src/app/translater.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: BulkServiceBarPage
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
  declarations: [BulkServiceBarPage],
  providers: [
    BulkServiceBarService
  ]
})
export class BulkServiceBarPageModule { }
