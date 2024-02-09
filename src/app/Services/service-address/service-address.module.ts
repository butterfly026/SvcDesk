import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { ServiceAddressHistoryComponent, ServiceAddressManagementComponent } from './components';
import { SharedModule } from 'src/app/Shared/shared.module';
import { ComponentsModule } from 'src/app/component/components.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslaterModule,
    JQWidgetModule,
    MaterialShareModule,
    ComponentsModule,
    SharedModule
  ],
  exports: [
    ServiceAddressManagementComponent
  ],
  declarations: [
    ServiceAddressHistoryComponent,
    ServiceAddressManagementComponent
  ]
})
export class ServiceAddressModule { }
