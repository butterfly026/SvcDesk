import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {AvailableReportPage} from './available-report.page';
import {TranslaterModule} from 'src/app/translater.module';
import {MaterialShareModule} from 'src/app/materialshare.module';
import {JQWidgetModule} from 'src/app/jqWidet.module';
import {ResponsiveGridDirective} from './directives/responsive-grid.directive';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
    {
        path: '',
        component: AvailableReportPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        TranslaterModule,
        MaterialShareModule,
        JQWidgetModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        ComponentsModule
    ],
    declarations: [AvailableReportPage, ResponsiveGridDirective]
})
export class AvailableReportPageModule {
}
