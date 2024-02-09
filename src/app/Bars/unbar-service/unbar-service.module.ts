import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UnbarServicePage } from './unbar-service.page';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { TranslaterModule } from 'src/app/translater.module';
import { UnBarServiceService } from './services/unbar-service.service';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: UnbarServicePage
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
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UnbarServicePage],
  providers: [
    UnBarServiceService,
  ]
})
export class UnbarServicePageModule { }
