import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {RechargeStatusListPage} from './recharge-status-list.page';
import {ResponsiveGridDirective} from './directives/responsive-grid.directive';
import {SearchPipe} from './pipes/search.pipe';
import {JQWidgetModule} from 'src/app/jqWidet.module';
import {MaterialShareModule} from 'src/app/materialshare.module';
import {TranslaterModule} from 'src/app/translater.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
    {
        path: '',
        component: RechargeStatusListPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        JQWidgetModule,
        MaterialShareModule,
        TranslaterModule,
        RouterModule.forChild(routes),
        ComponentsModule
    ],
    declarations: [RechargeStatusListPage, ResponsiveGridDirective, SearchPipe]
})
export class RechargeStatusListPageModule {
}
