import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { TransactionHistoryPage } from './transaction-history/transaction-history.page';
import { PaginationModule } from '../component/paging-component/pagination.module';
import { TransactionHistoryService } from './transaction-history/services/transaction-history.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
        PaginationModule,
    ],
    exports: [
        TransactionHistoryPage,
    ],
    declarations: [
        TransactionHistoryPage,
    ],
    providers: [
        TransactionHistoryService
    ]
})
export class TransactionsModule { }
