import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ForgotPasswordPage } from './forgot-password.page';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { ComponentsModule } from 'src/app/component/components.module';

const routes: Routes = [
    {
        path: '',
        component: ForgotPasswordPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialShareModule,
        TranslaterModule,
        ComponentsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ForgotPasswordPage],
    providers: []
})
export class ForgotPasswordPageModule {
}
