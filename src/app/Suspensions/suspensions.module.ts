import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuspensionsNewComponent } from './components';
import { SharedModule } from '../Shared/shared.module';
import { MaterialShareModule } from '../materialshare.module';
import { IonicModule } from '@ionic/angular';
import { TranslaterModule } from '../translater.module';
import { FormsModule } from '@angular/forms';
import { JQWidgetModule } from '../jqWidet.module';



@NgModule({
  declarations: [
    SuspensionsNewComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    JQWidgetModule,
    SharedModule,
    MaterialShareModule,
    TranslaterModule
  ],
  exports: [
    SuspensionsNewComponent
  ]
})
export class SuspensionsModule { }
