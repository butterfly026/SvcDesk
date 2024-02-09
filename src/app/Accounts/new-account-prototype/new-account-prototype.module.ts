import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CdkStepper } from '@angular/cdk/stepper';

import { TranslaterModule } from 'src/app/translater.module';
import { PaginationModule } from 'src/app/component/paging-component/pagination.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { SharedModule } from 'src/app/Shared/shared.module';
import {
  ChannelPartnersAutocompleteComponent,
  NewAccountAddressesComponent, 
  NewAccountAddressesElementComponent, 
  NewAccountAuthenticationComponent, 
  NewAccountAuthenticationEmailComponent,
  NewAccountAuthenticationMobileComponent,
  NewAccountAuthenticationPasswordComponent,
  NewAccountAuthenticationLoginIdComponent,
  NewAccountContactPhonesComponent, 
  NewAccountContactPhonesElementComponent, 
  NewAccountDetailsComponent, 
  NewAccountEmailsComponent,
  NewAccountEmailsElementComponent, 
  NewAccountIdentificationDocumentsComponent, 
  NewAccountIdentificationDocumentsElementComponent, 
  NewAccountOptionsComponent, 
  NewAccountPrototypeComponent, 
  NewAccountSecurityQuestionsComponent, 
  NewAccountSecurityQuestionsElementComponent, 
  NewAccountTypeComponent 
} from './components';



@NgModule({
  declarations: [
    NewAccountPrototypeComponent,
    NewAccountTypeComponent,
    NewAccountDetailsComponent,
    NewAccountContactPhonesComponent,
    NewAccountAuthenticationEmailComponent,
    NewAccountAuthenticationMobileComponent,
    NewAccountAuthenticationPasswordComponent,
    NewAccountAuthenticationLoginIdComponent,
    NewAccountContactPhonesElementComponent,
    NewAccountEmailsComponent,
    NewAccountEmailsElementComponent,
    NewAccountAddressesComponent,
    NewAccountAddressesElementComponent,
    NewAccountOptionsComponent,
    ChannelPartnersAutocompleteComponent,
    NewAccountIdentificationDocumentsComponent,
    NewAccountIdentificationDocumentsElementComponent,
    NewAccountSecurityQuestionsComponent,
    NewAccountSecurityQuestionsElementComponent,
    NewAccountAuthenticationComponent
  ],
  exports: [
    NewAccountPrototypeComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TranslaterModule,
    PaginationModule,
    MaterialShareModule,
    JQWidgetModule,
    SharedModule,
  ],
  providers: [
    { provide: CdkStepper, useValue: {} }
]
})
export class NewAccountPrototypeModule { }
