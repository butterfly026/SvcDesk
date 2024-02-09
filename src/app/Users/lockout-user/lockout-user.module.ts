import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { PaginationModule } from 'src/app/component/paging-component/pagination.module';
import { LockoutUserComponent } from './lockout-user.component';
import { LockoutUserService } from './services/lockout-user.service';

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
        LockoutUserComponent,
    ],
    declarations: [
        LockoutUserComponent,
    ],
    providers: [
        LockoutUserService
    ]
})
export class LockOutUserModule {
}
