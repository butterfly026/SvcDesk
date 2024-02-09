import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChangePasswordPage } from './change-password.page';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { ChangePasswordComponentModule } from './change-password-component/change-password.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
    {
        path: '',
        component: ChangePasswordPage
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
        //ChangePasswordComponentModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ChangePasswordPage]
})
export class ChangePasswordPageModule {
}
