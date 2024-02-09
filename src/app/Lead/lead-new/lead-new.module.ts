import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {LeadNewPage} from './lead-new.page';
import {MaterialShareModule} from 'src/app/materialshare.module';
import {TranslaterModule} from 'src/app/translater.module';
import {JQWidgetModule} from 'src/app/jqWidet.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
    {
        path: '',
        component: LeadNewPage
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
    declarations: [LeadNewPage]
})
export class LeadPageModule {
}
