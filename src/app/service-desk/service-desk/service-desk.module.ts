import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ServiceDeskPage } from './service-desk.page';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { ServiceDeskComponentModule } from '../service-desk-component/service-desk-component.module';
import { ContactEmailModule } from 'src/app/Contacts/contacts-emails/contact-emails-component/contact-email.module';
import { MenuComponentModule } from 'src/app/Menu/menu-grid/menu-component/menu-component.module';
import { PortalMenuModule } from 'src/app/Menu/portal-menu/portal-menu.module';
import { ChangePasswordComponentModule } from 'src/app/auth/change-password/change-password-component/change-password.module';
import { ReportsModule } from 'src/app/Reports/reports/reports.module';
import { ContactQuestionsModule } from 'src/app/Contacts/contacts-questions/contacts-questions-component/ContactsQuestion.module';
import { ContactDocumentsModule } from 'src/app/Contacts/documents/contact-documents.module';
import { ContactsCostCentersModule } from 'src/app/Contacts/contacts-cost-centers/contacts-cost-centers.module';
import { ServiceDocumentsModule } from 'src/app/Services/documents/service-documents.module';

import { ContractsModule } from 'src/app/Configuration/contracts/contracts.module';
import { PenaltiesModule } from 'src/app/Configuration/penalties/penalties.module';
import { ContactAttributeModule } from 'src/app/Configuration/contact-attribute/ContactAttribute.Module';
import { ServiceAttributeModule } from 'src/app/Configuration/service-attribute/ServiceAttribute.Module';
import { ServiceProviderUserModule } from 'src/app/Users/service-provider-user/service-provider-user.module';
import { RelatedContactsModule } from 'src/app/Contacts/related-contacts/related-contacts.module';
import { BarComponentsModule } from 'src/app/Bars/Components/bar-components.module';
import { DiscountComponentsModule } from 'src/app/Discount/discount-component/DiscountComponents.Module';
import { FinancialModule } from 'src/app/Financial/financial.module';
import { LanguageModule } from 'src/app/select-language/language.module';
import { BillPdfComponentModule } from 'src/app/Bills/bill-pdf/bill-pdf/bill-pdf-component.Module';
import { BillComponentsModule } from 'src/app/Bills/bill-components.module';
import { ChargeOverrideModule } from 'src/app/Charges/charge-overrides/charge-overrides.module';
import { ConfigurationModule } from 'src/app/Configuration/configuration.module';
import { EventInstanceModule } from 'src/app/Events/Instances/event-instance.module';
import { DepositsModule } from 'src/app/Deposits/deposits.module';
import { InstallmentsModule } from 'src/app/Installments/installments.module';
import { AuthorisedAccountsListsModule } from 'src/app/AuthorisedAccounts/authorised-accounts.module';
import { ContactMessageImageModule } from 'src/app/Messages/contact-message-image/ContactMessageImage.module';
import { ServicesModule } from 'src/app/Services/services.module';
import { AccountsModule } from 'src/app/Accounts/Accounts.module';
import { ComponentsModule } from 'src/app/component/components.module';
import { CommissionsModule } from 'src/app/commission-management/commissions.module';
import { AccountChargesModule } from 'src/app/Charges/Charges/account-charges/charges.module';
import { HtmlEditorModule } from 'src/app/html-editor/html-editor.module';
import { ServiceChargesModule } from 'src/app/Charges/Charges/service-charges/service-charges.module';
import { AccountChargeDefinitionModule } from 'src/app/Charges/charge-definition/account-charge-definition/account-charge-definition.module';
import { AccountChargeGroupModule } from 'src/app/Charges/charge-group/account-charge-group/account-charge-group.module';
import { AccountChargeDisplayGroupModule } from 'src/app/Charges/charge-display-group/account-charge-display/account-charge-display-group.module';
import { TasksGroupsModule } from 'src/app/Tasks/task-group/account-task-group/tasks-groups.module';
import { TicketModule } from 'src/app/Tasks/Ticket/ticket.module';
import { AccountTaskPriorityModule } from 'src/app/Tasks/Priorities/account-task-priorities/account-tasks-priority.module';
import { EmailSendModule } from 'src/app/Messages/email-send/email-send.module';
import { SMSModule } from 'src/app/Messages/SMS/SMS.module';
import { PartnerModule } from 'src/app/Users/Partners/Partners.Module';
import { TasksResolutionsModule } from 'src/app/Tasks/Resolutions/Resolutions.Module';
import { TerminationsModule } from 'src/app/Services/Terminations/Termination.Module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NewAccountPrototypeModule } from 'src/app/Accounts/new-account-prototype/new-account-prototype.module';

const routes: Routes = [
  {
    path: '',
    component: ServiceDeskPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JQWidgetModule,
    MaterialShareModule,
    TranslaterModule,
    ContactEmailModule,
    ServiceDeskComponentModule,
    MenuComponentModule,
    PortalMenuModule,
    ChangePasswordComponentModule,

    RelatedContactsModule,
    ReportsModule,
    ContactQuestionsModule,
    ContactDocumentsModule,
    ContactsCostCentersModule,
    ContactAttributeModule,
    ServiceAttributeModule,
    ServiceProviderUserModule,
    PartnerModule,
    TerminationsModule,
    AccountChargesModule,
    BarComponentsModule,
    DiscountComponentsModule,
    FinancialModule,
    EmailSendModule,
    LanguageModule,
    BillPdfComponentModule,
    BillComponentsModule,
    DepositsModule,
    InstallmentsModule,
    AuthorisedAccountsListsModule,
    ContractsModule,
    PenaltiesModule,
    ChargeOverrideModule,
    ConfigurationModule,
    ServiceChargesModule,
    ServiceDocumentsModule,

    EventInstanceModule,
    SMSModule,
    ContactMessageImageModule,
    ServicesModule,
    AccountsModule,
    CommissionsModule,

    RouterModule.forChild(routes),
    ComponentsModule,
    AccountChargeDefinitionModule,
    HtmlEditorModule,
    AccountChargeGroupModule,
    AccountChargeDisplayGroupModule,
    TasksGroupsModule,
    TicketModule,
    AccountTaskPriorityModule,
    TasksResolutionsModule,
    NewAccountPrototypeModule
  ],
  declarations: [
    ServiceDeskPage,
  ],
  exports: [
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ]
})
export class ServiceDeskPageModule { }
