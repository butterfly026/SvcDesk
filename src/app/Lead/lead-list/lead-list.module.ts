import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LeadListPage } from './lead-list.page';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { ResponsiveGridDirective } from './directives/responsive-grid.directive';
import { SearchPipe } from './pipes/search.pipe';
import { ComponentsModule } from 'src/app/component/components.module';


const routes: Routes = [
    {
        path: '',
        component: LeadListPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        MaterialShareModule,
        TranslaterModule,
        FormsModule,
        JQWidgetModule,
        IonicModule,
        RouterModule.forChild(routes),
        ComponentsModule
    ],
    declarations: [LeadListPage, SearchPipe, ResponsiveGridDirective]
})
export class LeadListPageModule {
}
