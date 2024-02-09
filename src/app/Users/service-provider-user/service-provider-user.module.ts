import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { PaginationModule } from 'src/app/component/paging-component/pagination.module';
import { ServiceProviderUserComponent } from './service-provider-user.component';
import { ServiceProviderUserService } from './services/service-provider-user-service';
import { LockOutUserModule } from '../lockout-user/lockout-user.module';
import { ResetPasswordModule } from '../reset-password/reset-password.module';
import { AuthenticationModule } from '../authentication-detail/authentication-detail.module';
import { SharedModule } from 'src/app/Shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialShareModule,
        TranslaterModule,
        JQWidgetModule,
        PaginationModule,
        LockOutUserModule,
        AuthenticationModule,
        SharedModule,
    ],
    exports: [
        ServiceProviderUserComponent,
    ],
    declarations: [
        ServiceProviderUserComponent,
    ],
    providers: [
        ServiceProviderUserService,
    ]
})
export class ServiceProviderUserModule {
}
