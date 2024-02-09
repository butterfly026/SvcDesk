import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { CookieService } from 'ngx-cookie-service';

import { ServiceDeskSearchPage } from './service-desk-search/service-desk-search.page';
import { ServiceDeskSearchOptionsComponent } from './service-desk-search/service-desk-search-options/service-desk-search-options.component';
import { ContactsAliasesComponentModule } from 'src/app/Contacts/contacts-aliases/contacts-aliases-component/contacts-aliases-component.module';
import { ContactsPhoneComponentModule } from 'src/app/Contacts/contacts-phones/contact-phones-component/contact-phones-component.module';
import { AccountServiceGroupModule } from 'src/app/account-service-groups/account-service-group.module';
import { ContactsNotesModule } from 'src/app/Contacts/contacts-notes/contacts-notes-component/contacts-notes.module';
import { BillComponentsModule } from 'src/app/Bills/bill-components.module';
import { TransactionsModule } from 'src/app/Transactions/transactions.module';
import { ContactsAddressComponentModule } from 'src/app/Contacts/contacts-address/contacts-address-component/contacts-address-component.module';
import { UpdatePaymentPage } from './update-payment/update-payment.page';
import { ContactMethodsPage } from './contact-methods/contact-methods/contact-methods.page';
import { EmailPage } from './Email/email/email.page';
import { BillListUcRetailPage } from 'src/app/Financial/bill-list-uc-retail/bill-list-uc-retail.page';
import { AdvancedSearchPage } from './advanced-search/advanced-search.page';
import { ListPaymentPage } from './list-payment/list-payment.page';
import { NewPaymentPage } from './new-payment/new-payment.page';
import { ServiceListPage } from './service-list/service-list.page';
import { CustomerDetailSectionPage } from './customer-detail-section/customer-detail-section.page';
import { InvoiceDetailsPage } from './invoice-details/invoice-details.page';
import { ServiceCostCentrePage } from './service-cost-centre/service-cost-centre.page';
import { ServiceDetailPage } from './service-detail/service-detail.page';
import { ServiceDeskMainPage } from './service-desk-main/service-desk-main.page';
import { ServiceDeskServiceGroupPage } from './service-desk-service-group/service-desk-service-group.page';
import { ContactEmailModule } from 'src/app/Contacts/contacts-emails/contact-emails-component/contact-email.module';
import { ServiceDeskServiceTabPage } from './service-desk-service-tab/service-desk-service-tab.page';
import { ContactPaymentMethodModule } from 'src/app/Contacts/contacts-payment-method/contact-payment-method-component/ContactPaymentMethod.module';
import { ServiceTypePage } from './service-type/service-type.page';
import { ServiceTypeChildPage } from './service-type/service-type-child/service-type-child.page';
import { ServiceStatusPage } from './service-status/service-status.page';
import { ServiceCostServicePage } from './service-cost-service/service-cost-service.page';
import { ServiceStatusServicePage } from './service-status-service/service-status-service.page';
import { ServiceGroupPage } from './service-group/service-group.page';
import { ServiceGroupServicePage } from './service-group-service/service-group-service.page';
import { ServiceSitesPage } from './service-sites/service-sites.page';
import { ServiceSitesServicePage } from './service-sites-service/service-sites-service.page';
import { ServiceChangesServicePage } from './service-changes-service/service-changes-service.page';
import { ServiceChangesPage } from './service-changes/service-changes.page';
import { ServicePlansPage } from './service-plans/service-plans.page';
import { ServicePlansServicePage } from './service-plans-service/service-plans-service.page';
import { ServiceDeskSearchService } from './service-desk-search/services/service-desk-search.service';
import { FinancialModule } from 'src/app/Financial/financial.module';
import { PaginationModule } from 'src/app/component/paging-component/pagination.module';
import { UsageServiceModule } from '../../Usage/Service/usage.module';
import { ComponentsModule } from 'src/app/component/components.module';
import { EventInstanceModule } from 'src/app/Events/Instances/event-instance.module';
import { ServicesModule } from 'src/app/Services/services.module';
import { AccountsModule } from 'src/app/Accounts/Accounts.module';
import { ServicePlanModule } from 'src/app/Plan/History/Service/service-plan.module';
import { AccountPlanModule } from 'src/app/Plan/History/Account/account-plan.module';
import { MessageModule } from 'src/app/Messages/message.module';
import { ContactMessageImageModule } from 'src/app/Messages/contact-message-image/ContactMessageImage.module';
import { ChargeOverrideModule } from 'src/app/Charges/charge-overrides/charge-overrides.module';
import { UserDefinedDataModule } from 'src/app/user-defined-data/UserDefinedData.Module';
import { AccountChargesModule } from 'src/app/Charges/Charges/account-charges/charges.module';
import { UsageAccountModule } from 'src/app/Usage/Account/usage.module';
import { ConfigurationModule } from 'src/app/Configuration/configuration.module';
import { ServiceAttributeModule } from 'src/app/Attributes/Services/service-attribute.module';
import { ServiceDocumentsModule } from 'src/app/Services/documents/service-documents.module';
import { ServiceCostCentersModule } from 'src/app/Services/service-cost-center/service-cost-centers.module';
import { ContactDocumentsModule } from 'src/app/Contacts/documents/contact-documents.module';
import { ContactsCostCentersModule } from 'src/app/Contacts/contacts-cost-centers/contacts-cost-centers.module';
import { DiscountComponentsModule } from 'src/app/Discount/discount-component/DiscountComponents.Module';
import { AccountChargeGroupModule } from 'src/app/Charges/charge-group/account-charge-group/account-charge-group.module';
import { ServiceChargesModule } from 'src/app/Charges/Charges/service-charges/service-charges.module';
import { AuthenticationModule } from 'src/app/Users/authentication/authentication.module';
import { ContactQuestionsModule } from 'src/app/Contacts/contacts-questions/contacts-questions-component/ContactsQuestion.module';
import { EmailSendModule } from 'src/app/Messages/email-send/email-send.module';
import { SMSModule } from 'src/app/Messages/SMS/SMS.module';
import { BillDisputesAccountModule } from 'src/app/Bills/Disputes/bill-disputes-account/bill-disputes.Module';
import { DepositsModule } from 'src/app/Deposits/deposits.module';
import { InstallmentsModule } from 'src/app/Installments/installments.module';
import { AuthorisedAccountsListsModule } from 'src/app/AuthorisedAccounts/authorised-accounts.module';
import { ContractsModule } from 'src/app/Configuration/contracts/contracts.module';
import { PenaltiesModule } from 'src/app/Configuration/penalties/penalties.module';
import { ServiceTasksListModule } from 'src/app/Tasks/service-task-list/service-task-list.module';
import { AccountTasksListModule } from 'src/app/Tasks/account-task-lists/account-task-list.module';
import { DepositStatusReasonsModule } from 'src/app/deposit-status-reasons/deposit-status-reasons.module';
import { BillDisputesModule } from 'src/app/Bills/Disputes/Bill-Disputes/BillDisputes.module';
import { TerminationsModule } from 'src/app/Services/Terminations/Termination.Module';
import { EnquiryPasswordModule } from 'src/app/Contacts/contacts-enquiry-password/EnquiryPassword.module';
import { ServiceEnquiryPasswordModule } from 'src/app/Services/service-enquiry-password/ServiceEnquriyPassword.module';
import { SharedModule } from 'src/app/Shared/shared.module';
import { RelatedContactsModule } from 'src/app/Contacts/related-contacts/related-contacts.module';
import { SuspensionsModule } from 'src/app/Suspensions/suspensions.module';
import { ServiceAddressModule } from 'src/app/Services/service-address/service-address.module';
import { ServiceNovationsModule } from 'src/app/Services/service-novations/service-novations.module';
//app/Tasks/service-task-list/service-task-list.module
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
        ContactEmailModule,
        ContactsPhoneComponentModule,
        ContactsAliasesComponentModule,
        ContactsAddressComponentModule,
        AccountServiceGroupModule,
        ContactsNotesModule,
        TransactionsModule,
        ContactPaymentMethodModule,
        FinancialModule,
        PaginationModule,
        UsageAccountModule,
        UsageServiceModule,
        EmailSendModule,
        ComponentsModule,
        EventInstanceModule,
        AccountChargesModule,
        ServiceChargesModule,
        ServicesModule,
        AccountsModule,
        ServicePlanModule,
        AccountPlanModule,
        MessageModule,
        SMSModule,
        ContactMessageImageModule,
        ChargeOverrideModule,
        UserDefinedDataModule,
        TerminationsModule,
        ConfigurationModule,
        ServiceAttributeModule,
        ContactDocumentsModule,
        ContactsCostCentersModule,
        DiscountComponentsModule,
        AccountChargeGroupModule,
        BillComponentsModule,
        BillDisputesAccountModule,
        DepositsModule,
        InstallmentsModule,
        AuthorisedAccountsListsModule,
        ContractsModule,
        PenaltiesModule,
        ServiceTasksListModule,
        AccountTasksListModule,
        DepositStatusReasonsModule,
        BillDisputesModule,
        AuthenticationModule,
        ContactQuestionsModule,
        EnquiryPasswordModule,
        ServiceEnquiryPasswordModule,
        ServiceDocumentsModule,
        ServiceCostCentersModule,
        RelatedContactsModule,
        SharedModule,
        SuspensionsModule,
        ServiceAddressModule,
        ServiceNovationsModule
    ],
    exports: [
        ServiceDeskSearchPage,
        ServiceDeskMainPage,
        ServiceDeskServiceTabPage,
        ServiceDeskServiceGroupPage,
        UpdatePaymentPage,
        ContactMethodsPage,
        EmailPage,
        BillListUcRetailPage,
        AdvancedSearchPage,
        ListPaymentPage,
        NewPaymentPage,
        ServiceListPage,
        ServiceDetailPage,
        CustomerDetailSectionPage,
        InvoiceDetailsPage,
        ServiceCostCentrePage,
        ServiceTypePage,
        ServiceTypeChildPage,
        ServiceStatusPage,
        ServiceCostServicePage,
        ServiceStatusServicePage,
        ServiceGroupPage,
        ServiceGroupServicePage,
        ServiceSitesPage,
        ServiceSitesServicePage,
        ServiceChangesPage,
        ServiceChangesServicePage,
        ServicePlansPage,
        ServicePlansServicePage,
    ],
    declarations: [
        ServiceDeskSearchPage,
        ServiceDeskSearchOptionsComponent,
        ServiceDeskMainPage,
        ServiceDeskServiceTabPage,
        ServiceDeskServiceGroupPage,

        UpdatePaymentPage,
        ContactMethodsPage,
        EmailPage,
        BillListUcRetailPage,
        AdvancedSearchPage,
        ListPaymentPage,
        NewPaymentPage,
        ServiceListPage,
        ServiceDetailPage,
        CustomerDetailSectionPage,
        ServiceCostCentrePage,
        ServiceTypePage,
        ServiceTypeChildPage,
        ServiceStatusPage,
        ServiceCostServicePage,
        ServiceStatusServicePage,
        ServiceGroupPage,
        ServiceGroupServicePage,
        ServiceSitesPage,
        ServiceSitesServicePage,
        ServiceChangesPage,
        ServiceChangesServicePage,
        ServicePlansPage,
        ServicePlansServicePage,
        // BillHistoryPage,



        InvoiceDetailsPage,
    ],
    providers: [
        ServiceDeskSearchService,
        CookieService,
    ]
})
export class ServiceDeskComponentModule { }
