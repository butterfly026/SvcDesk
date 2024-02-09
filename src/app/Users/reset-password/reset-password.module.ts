import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { PaginationModule } from 'src/app/component/paging-component/pagination.module';
import { ResetPasswordComponent } from './reset-password.component';
import { ResetPasswordService } from './services/reset-password-service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialShareModule,
        TranslaterModule,
        JQWidgetModule,
        PaginationModule,
    ],
    exports: [
        ResetPasswordComponent,
    ],
    declarations: [
        ResetPasswordComponent,
    ],
    providers: [
        ResetPasswordService
    ]
})
export class ResetPasswordModule {
}
