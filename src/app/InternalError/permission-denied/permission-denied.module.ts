import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';

import {PermissionDeniedPage} from './permission-denied.page';
import {MaterialShareModule} from '../../materialshare.module';
import { ComponentsModule } from 'src/app/component/components.module';


const routes: Routes = [
    {
        path: '',
        component: PermissionDeniedPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialShareModule,
        TranslateModule,
        IonicModule,
        RouterModule.forChild(routes),
        ComponentsModule
    ],
    declarations: [PermissionDeniedPage]
})
export class PermissionDeniedPageModule {
}
