import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PenaltiesListsComponent } from './components/penalties-lists/penalties-lists.component';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { JQWidgetModule } from '../../jqWidet.module';
import { MaterialShareModule } from '../../materialshare.module';
import { TranslaterModule } from '../../translater.module';
import { SharedModule } from '../../Shared/shared.module';
import { NgxCurrencyModule } from "ngx-currency";

@NgModule({
  imports: [
    CommonModule,
    
    IonicModule,
    FormsModule,
    TranslaterModule,
    JQWidgetModule,
    MaterialShareModule,
    NgxCurrencyModule,
    SharedModule,
  ],
  exports: [
    PenaltiesListsComponent,
  ],
  declarations: [
    PenaltiesListsComponent,
  ],
})
export class PenaltiesModule { }
