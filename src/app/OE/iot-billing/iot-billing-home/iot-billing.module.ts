import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { IOTBillingHomePage } from './iot-billing-home.page';
import { IOTBillingPlansPage } from './iot-billing-plans/iot-billing-plans.page';
import { IOTBillingPlanNowPage } from './iot-billing-plan-now/iot-billing-plan-now.page';
import { IOTBillingExitNumberPage } from './iot-billing-exit-number/iot-billing-exit-number.page';
import { IOTBillingNewNumberPage } from './iot-billing-new-number/iot-billing-new-number.page';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
    ],
    exports: [
        IOTBillingHomePage,
        IOTBillingPlansPage,
        IOTBillingPlanNowPage,
        IOTBillingExitNumberPage,
        IOTBillingNewNumberPage,
    ],
    declarations: [
        IOTBillingHomePage,
        IOTBillingPlansPage,
        IOTBillingPlanNowPage,
        IOTBillingExitNumberPage,
        IOTBillingNewNumberPage,
    ],
    providers: [
    ]
})
export class IOTBillingModule { }
