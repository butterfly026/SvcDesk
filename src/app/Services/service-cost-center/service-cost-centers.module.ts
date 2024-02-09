import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { SharedModule } from 'src/app/Shared/shared.module';
import { 
  ServiceCostCenterDetailsComponent, 
  ServiceCostCenterEditComponent, 
  ServiceCostCenterListComponent, 
  ServiceCostCenterNewComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialShareModule,
    JQWidgetModule,
    TranslaterModule,
    SharedModule
  ],
  exports: [
    ServiceCostCenterListComponent,
    ServiceCostCenterEditComponent,
    ServiceCostCenterNewComponent,
    ServiceCostCenterDetailsComponent
  ],
  declarations: [
    ServiceCostCenterListComponent,
    ServiceCostCenterEditComponent,
    ServiceCostCenterNewComponent,
    ServiceCostCenterDetailsComponent
  ],
  providers: []
})
export class ServiceCostCentersModule { }
