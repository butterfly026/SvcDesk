import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillPdfPageRoutingModule } from './bill-pdf-routing.module';

import { BillPdfPage } from './bill-pdf.page';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { BillPdfComponentModule } from './bill-pdf/bill-pdf-component.Module';
import { ComponentsModule } from 'src/app/component/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillPdfPageRoutingModule,
    TranslaterModule,
    JQWidgetModule,
    MaterialShareModule,
    ComponentsModule,
    BillPdfComponentModule,
  ],
  declarations: [BillPdfPage]
})
export class BillPdfPageModule { }
