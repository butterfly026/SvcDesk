import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ActivationKeyPage } from './activation-key.page';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { TranslaterModule } from 'src/app/translater.module';
import { ActivationKeyService } from './services/activation-key.service';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
  {
    path: '',
    component: ActivationKeyPage
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
  declarations: [ActivationKeyPage],
  providers: [
    ActivationKeyService,
  ]
})
export class ActivationKeyPageModule { }
