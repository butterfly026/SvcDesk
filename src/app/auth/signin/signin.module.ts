import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';


import { SigninPage } from './components/signin.component';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { SignInService } from './services/signin.service';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { AuthComponentModule } from '../auth-components/auth-component.module';
import { ChangePasswordComponentModule } from '../../auth/change-password/change-password-component/change-password.module';

const routes: Routes = [
    {
        path: '',
        component: SigninPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslaterModule,
        MaterialShareModule,
        JQWidgetModule,
        AuthComponentModule,
        ChangePasswordComponentModule,
        RouterModule.forChild(routes)
    ],
    declarations: [SigninPage],
    providers: [
        SignInService,
        Device,
        DatePipe,
    ]
})
export class SigninPageModule {
}
