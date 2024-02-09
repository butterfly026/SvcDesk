import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProcedureListPage } from './procedure-list.page';
import { ResponsiveGridDirective } from './directives/responsive-grid.directive';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { SearchPipe } from './pipes/search.pipe';
import {NumberDirective} from 'src/app/../directives/number-only.directive';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
    {
        path: '',
        component: ProcedureListPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
        RouterModule.forChild(routes),
        ComponentsModule
    ],
    declarations: [ProcedureListPage, SearchPipe, ResponsiveGridDirective, NumberDirective]
})
export class ProcedureListPageModule {
}
