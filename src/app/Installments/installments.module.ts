import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { JQWidgetModule } from '../jqWidet.module';
import { MaterialShareModule } from '../materialshare.module';
import { TranslaterModule } from '../translater.module';
import { SharedModule } from '../Shared/shared.module';
import { NgxCurrencyModule } from "ngx-currency";
import {
  AccountInstallmentsListsComponent,
  AccountInstallmentsFormComponent,
} from './components';

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
    AccountInstallmentsListsComponent,
  ],
  declarations: [
    AccountInstallmentsListsComponent,
    AccountInstallmentsFormComponent,
  ]
})
export class InstallmentsModule { }