import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {HomePage} from './home.page';
import {TranslaterModule} from '../translater.module';
import {MaterialShareModule} from '../materialshare.module';
import { ComponentsModule } from '../component/components.module';

const routes: Routes = [
    {
        path: '',
        component: HomePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslaterModule,
        MaterialShareModule,
        RouterModule.forChild(routes),
        ComponentsModule,
    ],
    declarations: [HomePage]
})
export class HomePageModule {
}
