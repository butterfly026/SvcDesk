import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {RechargeUpsertPage} from './recharge-upsert.page';
import {JQWidgetModule} from 'src/app/jqWidet.module';
import {TranslaterModule} from 'src/app/translater.module';
import {MaterialShareModule} from 'src/app/materialshare.module';
import {InputDisableControlDirective} from './directives/input-disable-control.directive';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
    {
        path: '',
        component: RechargeUpsertPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        JQWidgetModule,
        TranslaterModule,
        MaterialShareModule,
        IonicModule,
        RouterModule.forChild(routes),
        ComponentsModule
    ],
    declarations: [RechargeUpsertPage, InputDisableControlDirective]
})
export class RechargeUpsertPageModule {
}
