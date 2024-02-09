import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { SharedModule } from 'src/app/Shared/shared.module';
import {
  ContactsCostCentersListComponent, 
  ContactsCostCentersDetailsComponent, 
  ContactsCostCentersEditComponent, 
  ContactsCostCentersNewComponent, 
} from './components';

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
    ContactsCostCentersListComponent,
  ],
  declarations: [
    ContactsCostCentersListComponent,
    ContactsCostCentersDetailsComponent, 
    ContactsCostCentersEditComponent, 
    ContactsCostCentersNewComponent, 
  ],
  providers: []
})
export class ContactsCostCentersModule { }
