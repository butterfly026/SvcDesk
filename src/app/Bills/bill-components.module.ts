import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { BillHistoryPage } from './bill-history/bill-history.page';
import { BillNowPage } from './bill-now/bill-now.page';
import { PaginationModule } from '../component/paging-component/pagination.module';
import { TransactionsModule } from '../Transactions/transactions.module';
import { BillChargesComponent } from './bill-charges/bill-charges.component';
import { BillServicesComponent } from './bill-services/bill-services.component';
import { BillTransactionsComponent } from './bill-transactions/bill-transactions.component';
import { BillTransactionsDetailComponent } from './bill-transactions-detail/bill-transactions-detail.component';
import { BillOptionsComponent } from './bill-options/bill-options.component';
import { ComponentsModule } from '../component/components.module';
import { BillDelegationComponent } from './Delegations/DelegationAccount/bill-delegation.component';
import { DelegationFormComponent } from './Delegations/DelegationAccount/delegation-form/delegation-form.component';
import { DelegationListComponent } from './Delegations/DelegationAccount/delegation-list/delegation-list.component';
import { BillEmailComponent } from './bill-email/bill-email.component';
import { AccountChargesModule } from '../Charges/Charges/account-charges/charges.module';
import { EmailSendModule } from '../Messages/email-send/email-send.module';
import { BillDisputesAccountModule } from './Disputes/bill-disputes-account/bill-disputes.Module';
import { SharedModule } from '../Shared/shared.module';
import { BillFinancialDocumentsDetailComponent } from './bill-financial-documents-detail/bill-financial-documents-detail.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
        PaginationModule,
        EmailSendModule,
        TransactionsModule,
        AccountChargesModule,
        ComponentsModule,
        BillDisputesAccountModule,
        SharedModule
    ],
    exports: [
        BillHistoryPage,
        BillNowPage,
        BillChargesComponent,
        BillServicesComponent,
        BillTransactionsComponent,
        BillTransactionsDetailComponent,
        BillOptionsComponent,
        BillDelegationComponent,
        DelegationFormComponent,
        DelegationListComponent,
        BillEmailComponent,
    ],
    declarations: [
        BillHistoryPage,
        BillNowPage,
        BillChargesComponent,
        BillServicesComponent,
        BillTransactionsComponent,
        BillTransactionsDetailComponent,
        BillOptionsComponent,
        BillDelegationComponent,
        DelegationFormComponent,
        DelegationListComponent,
        BillEmailComponent,
        BillFinancialDocumentsDetailComponent
    ],
    providers: [
        // DelegationListService,
        // DelegationFormService,
        // BillEmailService,
        // BillNowService,
    ]
})
export class BillComponentsModule { }
