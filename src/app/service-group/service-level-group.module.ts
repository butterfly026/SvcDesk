import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { AssignedServiceAddPage } from './assigned-service-add/assigned-service-add.page';
import { ServiceGroupPage } from './service-group.page';
import { ServiceGroupDetailPage } from './service-group-detail/service-group-detail.page';

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
        ServiceGroupPage,
        AssignedServiceAddPage,
        ServiceGroupDetailPage,
    ],
    declarations: [
        ServiceGroupPage,
        AssignedServiceAddPage,
        ServiceGroupDetailPage,
    ],
    providers: [
    ]
})
export class ServiceLevelGroupModule { }
