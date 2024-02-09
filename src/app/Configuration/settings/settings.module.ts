import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {SettingsPage} from './settings.page';
import {MaterialShareModule} from 'src/app/materialshare.module';
import {TranslaterModule} from 'src/app/translater.module';
import {JQWidgetModule} from 'src/app/jqWidet.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
    {
        path: '',
        component: SettingsPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialShareModule,
        TranslaterModule,
        JQWidgetModule,
        ComponentsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [SettingsPage]
})
export class SettingsPageModule {
}
