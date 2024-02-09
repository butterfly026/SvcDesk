import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "../jqWidet.module";
import { MaterialShareModule } from "../materialshare.module";
import { TranslaterModule } from "../translater.module";
import { TillComponent } from "./till/till.component";

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import {MatGridListModule} from '@angular/material/grid-list';

@NgModule({  
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,   
    TranslaterModule,
    JQWidgetModule,
    MaterialShareModule,
  ],
  declarations: [
    TillComponent,
  ],
  exports: [
    TillComponent,
  ]
})
export class PaymentMethodsModule { }
