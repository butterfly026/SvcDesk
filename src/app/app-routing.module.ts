import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './auth/signin/services/auth-guard.service';

const routes: Routes = [

    { path: '', redirectTo: 'auth/signin', pathMatch: 'full' },
    {
        path: 'auth/signin',
        loadChildren: () => import('./auth/signin/signin.module').then(m => m.SigninPageModule)
    },
    {
        path: 'auth/signin/:username/:password/:apikey/:path',
        loadChildren: () => import('./auth/signin/signin.module').then(m => m.SigninPageModule)
    },
    {
        path: 'auth/change-password',
        loadChildren: () => import('./auth/change-password/change-password-page.module').then(m => m.ChangePasswordPageModule)
    },
    {
        path: 'auth/role-select',
        loadChildren: () => import('./auth/role-select/role-select.module').then(m => m.RoleSelectPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'auth/business-unit-select',
        loadChildren: () => import('./auth/business-unit-select/business-unit-select.module').then(m => m.BusinessUnitSelectPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'auth/pin-enter',
        loadChildren: () => import('./auth/pin-enter/pin-enter.module').then(m => m.PinEnterPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'auth/pin-unlock',
        loadChildren: () => import('./auth/pin-unlock/pin-unlock.module').then(m => m.PinUnlockPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'auth/fa-enter',
        loadChildren: () => import('./auth/fa-enter/fa-enter.module').then(m => m.FaEnterPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Payment/customer-payment-method-list',
        loadChildren: () => import('./Payment/customer-payment-method-list/customer-payment-method-list.module').then(m => m.CustomerPaymentMethodListPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Payment/customer-payment-method-list-new',
        loadChildren: () => import('./Payment/customer-payment-method-list-new/customer-payment-method-list-new.module').then(m => m.CustomerPaymentMethodListNewPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Payment/customer-payment-method-list-uc-bus',
        loadChildren: () => import('./Payment/customer-payment-method-list-uc-bus/customer-payment-method-list-uc-bus.module').then(m => m.CustomerPaymentMethodListUcBusPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Financials/receipt-detail',
        loadChildren: () => import('./Financial/receipt-detail/receipt-detail.module').then(m => m.ReceiptDetailPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Recharges/recharge-list',
        loadChildren: () => import('./Recharges/recharge-list/recharge-list.module').then(m => m.RechargeListPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Recharges/recharge-new',
        loadChildren: () => import('./Recharges/recharge-new/recharge-new.module').then(m => m.RechargeNewPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Recharges/recharge-simple-new',
        loadChildren: () => import('./Recharges/recharge-simple-new/recharge-simple-new.module').then(m => m.RechargeSimpleNewPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Recharges/recharge-simple-new/:CategoryId',
        loadChildren: () => import('./Recharges/recharge-simple-new/recharge-simple-new.module').then(m => m.RechargeSimpleNewPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Recharges/recharge-simple-list',
        loadChildren: () => import('./Recharges/recharge-simple-list/recharge-simple-list.module').then(m => m.RechargeSimpleListPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Recharges/recharge-simple-list/:CategoryId',
        loadChildren: () => import('./Recharges/recharge-simple-list/recharge-simple-list.module').then(m => m.RechargeSimpleListPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Recharges/activation-key/:key',
        loadChildren: () => import('./Recharges/activation-key/activation-key.module').then(m => m.ActivationKeyPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Discount/discount-list',
        loadChildren: () => import('./Discount/discount-list/discount-list.module').then(m => m.DiscountListPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Discount/discount-new',
        loadChildren: () => import('./Discount/discount-new/discount-new.module').then(m => m.DiscountNewPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Discount/discount-edit/:id',
        loadChildren: () => import('./Discount/discount-edit/discount-edit.module').then(m => m.DiscountEditPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'procedure-balance',
        loadChildren: () => import('./procedure-balance/procedure-balance.module').then(m => m.ProcedureBalancePageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Bars/bar-service/:Id',
        loadChildren: () => import('./Bars/bar-service/bar-service.module').then(m => m.BarServicePageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Bars/unbar-service/:Id',
        loadChildren: () => import('./Bars/unbar-service/unbar-service.module').then(m => m.UnbarServicePageModule),
        canActivate: [AuthGuardService]
    },

    {
        path: 'Notifications/notification-procedure',
        loadChildren: () => import('./Notifications/notification-procedure/notification-procedure.module').then(m => m.NotificationProcedurePageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Notifications/spend-notification-configration',
        loadChildren: () => import('./Notifications/spend-notification-configration/spend-notification-configuration.module').then(m => m.SpendNotificationConfigrationPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Notifications/spend-notification-history',
        loadChildren: () => import('./Notifications/spend-notification-history/spend-notification-history.module').then(m => m.SpendNotificationHistoryPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Services/service-type-change',
        loadChildren: () => import('./Services/service-type-change/service-type-change.module').then(m => m.ServiceTypeChangePageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Services/bulk-service-bar',
        loadChildren: () => import('./Services/bulk-service-bar/bulk-service-bar.module').then(m => m.BulkServiceBarPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Services/bulk-service-unbar',
        loadChildren: () => import('./Services/bulk-service-unbar/bulk-service-unbar.module').then(m => m.BulkServiceUnbarPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Services/bulk-service-group-change',
        loadChildren: () => import('./Services/bulk-service-group-change/bulk-service-group-change.module').then(m => m.BulkServiceGroupChangePageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Contacts/customer-contact-phones/:Id',
        loadChildren: () => import('./Contacts/contacts-phones/contacts-phones.module').then(m => m.ContactsPhonesPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Contacts/customer-emails',
        loadChildren: () => import('./Contacts/contacts-emails/contacts-emails.module').then(m => m.ContactsEmailsPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Contacts/customer-addresses',
        loadChildren: () => import('./Contacts/contacts-address/contacts-address.module').then(m => m.ContactsAddressPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Contacts/account-hierarchy',
        loadChildren: () => import('./Contacts/contacts-account-hierarchy/contacts-account-hierarchy.module').then(m => m.ContactsAccountHierarchyPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'ServiceGroups/service-group-list',
        loadChildren: () => import('./service-groups/service-group-list/service-group-list.module').then(m => m.ServiceGroupListPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'ServiceGroups/service-add/:Id',
        loadChildren: () => import('./service-groups/svc-svc-group-assignment-history/service-add/service-add.module').then(m => m.ServiceAddPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Devices/device-list',
        loadChildren: () => import('./Devices/device-list/device-list.module').then(m => m.DeviceListPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Devices/device-add',
        loadChildren: () => import('./Devices/device-add/device-add.module').then(m => m.DeviceAddPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Devices/device-update/:Id',
        loadChildren: () => import('./Devices/device-update/device-update.module').then(m => m.DeviceUpdatePageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Contacts/customer-new',
        loadChildren: () => import('./Contacts/customer-new/customer-new.module').then(m => m.CustomerNewPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Contacts/contact-new',
        loadChildren: () => import('./Contacts/contact-new/contact-new.module').then(m => m.ContactNewPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Services/bulk-disconnect/:Id',
        loadChildren: () => import('./Services/bulk-disconnect/bulk-disconnect.module').then(m => m.BulkDisconnectPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'ServiceGroups/ServiceServiceGroupAssignment/:Id',
        loadChildren: () => import('./service-groups/svc-svc-group-assignment-history/svc-svc-group-assignment-history.module').then(m => m.SvcSvcGroupAssignmentHistoryPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'ServiceGroups/ServiceGroupAssignedServices/:Id',
        loadChildren: () => import('./service-groups/svc-group-svc-assignment-history/svc-group-svc-assignment-history.module').then(m => m.SvcGroupSvcAssignmentHistoryPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'ServiceGroups/ServiceGroupServiceAdd/:Id',
        loadChildren: () => import('./service-groups/svc-group-assign-svc-add/svc-group-assign-svc-add.module').then(m => m.SvcGroupAssignSvcAddPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'ServiceGroups/ServiceGroupServiceBar/:Id/:Name',
        loadChildren: () => import('./service-groups/svc-group-svc-bar/svc-group-svc-bar.module').then(m => m.SvcGroupSvcBarPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'ServiceGroups/ServiceGroupServiceUnBar/:Id/:Name',
        loadChildren: () => import('./service-groups/svc-group-svc-unbar/svc-group-svc-unbar.module').then(m => m.SvcGroupSvcUnbarPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'ServiceGroups/service-group-component',
        loadChildren: () => import('./service-groups/service-group-component/service-group-component.module').then(m => m.ServiceGroupComponentPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'ServiceGroups/service-group-component/:ContactCode/:ServiceId/:APIKey',
        loadChildren: () => import('./service-groups/service-group-component/service-group-component.module').then(m => m.ServiceGroupComponentPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'RechargeAutoPurchase',
        loadChildren: () => import('./Recharges/recharge-auto-purchase/recharge-auto-purchase.module').then(m => m.RechargeAutoPurchasePageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'ServiceDesk',
        loadChildren: () => import('./service-desk/service-desk/service-desk.module').then(m => m.ServiceDeskPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'ContactsIdentification',
        loadChildren: () => import('./Contacts/contacts-identification/contacts-identification.module').then(m => m.ContactsIdentificationPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Contacts/Aliases',
        loadChildren: () => import('./Contacts/contacts-aliases/contacts-aliases.module').then(m => m.ContactsAliasesPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'iOTBilling/dashboard/:ContactCode',
        loadChildren: () => import('./OE/iot-billing/iot-billing-dashboard/iot-billing-dashboard.module').then(m => m.IOTBillingDashboardPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'OE/Home',
        loadChildren: () => import('./OE/OE-Home/oe-home/oe-home.module').then(m => m.OeHomePageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Contacts/Payment-method/:Id',
        loadChildren: () => import('./Contacts/contacts-payment-method/contacts-payment-method.module').then(m => m.ContactsPaymentMethodPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Contacts/contacts-notes/:Id',
        loadChildren: () => import('./Contacts/contacts-notes/contacts-notes.module').then(m => m.ContactsNotesPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Loyalty/:Id',
        loadChildren: () => import('./Loyalty/loyalty-home/loyalty-home.module').then(m => m.LoyaltyHomePageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Network/:Id',
        loadChildren: () => import('./Network/network-home/network-home.module').then(m => m.NetworkHomePageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'new-recharge', loadChildren: () => import('./New-Recharge/new-recharge/new-recharge.module').then(m => m.NewRechargePageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Contacts/charges', loadChildren: () => import('./Contacts/contacts-charges/contacts-charges.module').then(m => m.ContactsChargesPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'contacts-configuration',
        loadChildren: () => import('./Contacts/contacts-configuration/contacts-configuration.module').then(m => m.ContactsConfigurationPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'stripe-page',
        loadChildren: () => import('./Payment/stripe-page/stripe-page.module').then(m => m.StripePagePageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Contacts/questions',
        loadChildren: () => import('./Contacts/contacts-questions/contacts-questions.module').then(m => m.ContactsQuestionsPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'add-contract/:type',
        loadChildren: () => import('./add-contract/add-contract.module').then(m => m.AddContractPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'bill-pdf',
        loadChildren: () => import('./Bills/bill-pdf/bill-pdf.module').then(m => m.BillPdfPageModule),
        // canActivate: [AuthGuardService]
    },
    {
        path: 'configurations/messages/templates/new',
        loadChildren: () => import('./Messages/template-editor/template-editor.module').then(m => m.TemplateEditorModule),
        canActivate: [AuthGuardService]
    },    
    {
        path: 'Lead/lead-new',
        loadChildren: () => import('./Lead/lead-new/lead-new.module').then(m => m.LeadPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Lead/lead-list',
        loadChildren: () => import('./Lead/lead-list/lead-list.module').then(m => m.LeadListPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Configuration/settings',
        loadChildren: () => import('./Configuration/settings/settings.module').then(m => m.SettingsPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'InternalError/permission-denied',
        loadChildren: () => import('./InternalError/permission-denied/permission-denied.module').then(m => m.PermissionDeniedPageModule),
    },
    {
        path: 'Menu/menu-grid',
        loadChildren: () => import('./Menu/menu-grid/menu-grid.module').then(m => m.MenuGridsPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Recharges/recharge-status-list',
        loadChildren: () => import('./Recharges/recharge-status-list/recharge-status-list.module').then(m => m.RechargeStatusListPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Recharges/recharge-upsert/:recharge_status_id',
        loadChildren: () => import('./Recharges/recharge-upsert/recharge-upsert.module').then(m => m.RechargeUpsertPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Usage/procedure-list',
        loadChildren: () => import('./Usage/procedure-list/procedure-list.module').then(m => m.ProcedureListPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Usage/procedure-list',
        loadChildren: () => import('./Usage/procedure-list/procedure-list.module').then(m => m.ProcedureListPageModule),
        canActivate: [AuthGuardService]
    },
    {
        path: 'Reports/available-report/:cat_id',
        loadChildren: () => import('./Reports/available-report/available-report.module').then(m => m.AvailableReportPageModule),
        canActivate: [AuthGuardService]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
