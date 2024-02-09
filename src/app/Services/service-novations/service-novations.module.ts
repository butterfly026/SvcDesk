import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceNovationsListComponent, ServiceNovationsNewComponent, ServiceNovationsReverseComponent } from './components';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxCurrencyModule } from 'ngx-currency';
import { SharedModule } from 'src/app/Shared/shared.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';



@NgModule({
  imports: [
      IonicModule,
      CommonModule,
      FormsModule,
      NgxCurrencyModule,
      TranslaterModule,
      JQWidgetModule,
      MaterialShareModule,
      SharedModule,
  ],
  exports: [
      ServiceNovationsListComponent,
      ServiceNovationsNewComponent,
  ],
  declarations: [
      ServiceNovationsListComponent,
      ServiceNovationsNewComponent,
      ServiceNovationsReverseComponent
  ],
  providers: []
})

export class ServiceNovationsModule { }
