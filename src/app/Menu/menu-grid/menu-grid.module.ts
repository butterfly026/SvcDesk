import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {MenuGridPage} from './menu-grid.page';
import {MaterialShareModule} from 'src/app/materialshare.module';
import {JQWidgetModule} from 'src/app/jqWidet.module';
import {TranslaterModule} from 'src/app/translater.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AppHttpInterceptor} from 'src/app/app-http-interceptor';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
    {
        path: '',
        component: MenuGridPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
        IonicModule,
        RouterModule.forChild(routes),
        ComponentsModule
    ],
    declarations: [MenuGridPage],
    providers: [
        {
            provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true
        }
    ]
})
export class MenuGridsPageModule {
}
