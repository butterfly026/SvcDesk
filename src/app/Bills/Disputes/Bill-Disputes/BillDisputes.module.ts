import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgxCurrencyModule } from 'ngx-currency';
import { PaginationModule } from 'src/app/component/paging-component/pagination.module';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { BillDisputesComponent, BillFormComponent, BillDisputesListComponent, BillDisputesNewComponent, BillDisputesEditComponent, BillDisputesDetailComponent } from './components';
import { SharedModule } from 'src/app/Shared/shared.module';

@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
        PaginationModule,
        NgxCurrencyModule,
        SharedModule
    ],
    declarations: [
        BillDisputesComponent,
        BillDisputesListComponent,
        BillFormComponent,
        BillDisputesNewComponent,
        BillDisputesEditComponent,
        BillDisputesDetailComponent
    ],
    exports: [
        BillDisputesComponent,
        BillDisputesListComponent,
        BillFormComponent,
    ]
})

export class BillDisputesModule { }