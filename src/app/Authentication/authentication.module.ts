import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { TranslaterModule } from 'src/app/translater.module';
import { PaginationModule } from 'src/app/component/paging-component/pagination.module';
import { SharedModule } from 'src/app/Shared/shared.module';
import { ContactAuthenticationComponent } from './contact-authentication/contact-authentication.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialShareModule,
    JQWidgetModule,
    TranslaterModule,
    PaginationModule,
    SharedModule,
],
exports: [      
  ContactAuthenticationComponent,
],
declarations: [
  ContactAuthenticationComponent,
],
providers: []  
})
export class AuthenticationModule { }
