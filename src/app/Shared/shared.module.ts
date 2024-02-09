import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CdkMenuModule } from '@angular/cdk/menu';

import {
  DatatableComponent, 
  DatatableRowActionComponent, 
  SpinnerComponent, 
  MatAlertComponent, 
  DatatableToolbarComponent, 
  DialogComponent, 
  ParameterComponent, 
  ChipListAutocompleteComponent, 
  PaymentMethodsComponent, 
  PaymentMethodsNewCreditCardComponent,
  PaymentMethodsNewBankAccountComponent
} from './components';
import { CurrencyForLocalPipe, FormatStringPipe, SafeHtmlPipe, SpaceBeforCapitalLetterPipe, StringOrDatePipe } from './pipes';
import { MatPaginationIntlService } from './services';
import { JQWidgetModule } from '../jqWidet.module';
import { TranslaterModule } from '../translater.module';
import { MaterialShareModule } from '../materialshare.module';



@NgModule({
  declarations: [
    SpinnerComponent,
    MatAlertComponent,
    DatatableComponent,
    DatatableRowActionComponent,
    DatatableToolbarComponent,
    ChipListAutocompleteComponent,
    FormatStringPipe,
    SpaceBeforCapitalLetterPipe,
    StringOrDatePipe,
    CurrencyForLocalPipe,
    DialogComponent,
    ParameterComponent,
    SafeHtmlPipe,
    PaymentMethodsComponent,
    PaymentMethodsNewCreditCardComponent,
    PaymentMethodsNewBankAccountComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    JQWidgetModule,
    TranslaterModule,
    MaterialShareModule,
    FormsModule,
    CdkMenuModule,
  ],
  exports: [
    SpinnerComponent,
    MatAlertComponent,
    DatatableComponent,
    DialogComponent,
    ParameterComponent,
    ChipListAutocompleteComponent,
    PaymentMethodsComponent,
    FormatStringPipe,
    SpaceBeforCapitalLetterPipe,
    StringOrDatePipe,
    CurrencyForLocalPipe,
    SafeHtmlPipe,
    PaymentMethodsNewCreditCardComponent,
    PaymentMethodsNewBankAccountComponent
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginationIntlService
    }
  ]
})
export class SharedModule { }
