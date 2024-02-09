import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { AccountServicesPage } from './account-services/account-services.page';
import { AccountServiceAddPage } from './account-services/account-service-add/account-service-add.page';
import { AccountServiceGroupAddPage } from './account-service-group-add/account-service-group-add.page';
import { AccountServiceGroupUpdatePage } from './account-service-group-update/account-service-group-update.page';
import { AccountServiceGroupBarPage } from './account-service-group-bar/account-service-group-bar.page';
import { AccountServiceGroupUnbarPage } from './account-service-group-unbar/account-service-group-unbar.page';
import { AccountServiceGroupControlPage } from './account-service-group-control/account-service-group-control.page';
import { ServiceGroupAssignedServicesPage } from './account-services/service-group-assigned-services/service-group-assigned-services.page';
import { AccountServiceGroupsPage } from './account-service-groups.page';
import { AccountServiceGroupService } from './services/account-service-group.service';
import { AccountServiceService } from './account-services/services/account-services.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
    ],
    exports: [
        AccountServiceGroupsPage,
        AccountServicesPage,
        AccountServiceAddPage,
        AccountServiceGroupAddPage,
        AccountServiceGroupUpdatePage,
        AccountServiceGroupBarPage,
        AccountServiceGroupUnbarPage,
        AccountServiceGroupControlPage,
        ServiceGroupAssignedServicesPage,
    ],
    declarations: [
        AccountServiceGroupsPage,
        AccountServicesPage,
        AccountServiceAddPage,
        AccountServiceGroupAddPage,
        AccountServiceGroupUpdatePage,
        AccountServiceGroupBarPage,
        AccountServiceGroupUnbarPage,
        AccountServiceGroupControlPage,
        ServiceGroupAssignedServicesPage,
    ],
    providers: [
        AccountServiceGroupService,
        AccountServiceService,
    ]
})
export class AccountServiceGroupModule { }
