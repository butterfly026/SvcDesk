import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddContractPageRoutingModule } from './add-contract-routing.module';

import { AddContractPage } from './add-contract.page';
import { TranslaterModule } from '../translater.module';
import { JQWidgetModule } from '../jqWidet.module';
import { MaterialShareModule } from '../materialshare.module';
import { ComponentsModule } from '../component/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslaterModule,
    JQWidgetModule,
    MaterialShareModule,
    ComponentsModule,
    AddContractPageRoutingModule
  ],
  declarations: [AddContractPage]
})
export class AddContractPageModule { }
