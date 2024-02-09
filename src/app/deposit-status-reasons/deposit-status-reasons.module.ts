import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { JQWidgetModule } from '../jqWidet.module';
import { MaterialShareModule } from '../materialshare.module';
import { TranslaterModule } from '../translater.module';
import { DepositStatusFormComponent } from './deposit-status-form/deposit-status-form.component';
import { DepositStatusListComponent } from './deposit-status-list/deposit-status-list.component';
import { DepositStatusReasonsComponent } from './deposit-status-reasons.component';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
    ],
    exports: [
        DepositStatusReasonsComponent,
        DepositStatusListComponent,
        DepositStatusFormComponent,
    ],
    declarations: [
        DepositStatusReasonsComponent,
        DepositStatusListComponent,
        DepositStatusFormComponent,
    ]
})

export class DepositStatusReasonsModule {

}