import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StripePagePageRoutingModule } from './stripe-page-routing.module';

import { StripePagePage } from './stripe-page.page';
import { StripeComponentModule } from './stripe-component/StripeComponent.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { ComponentsModule } from 'src/app/component/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StripePagePageRoutingModule,
    StripeComponentModule,
    TranslaterModule,
    MaterialShareModule,
    JQWidgetModule,
    ComponentsModule
  ],
  declarations: [StripePagePage]
})
export class StripePagePageModule {}
