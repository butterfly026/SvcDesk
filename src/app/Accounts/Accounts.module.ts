import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { NgxCurrencyModule } from "ngx-currency";
import { ComponentsModule } from "../component/components.module";
import { ContactQuestionsModule } from "../Contacts/contacts-questions/contacts-questions-component/ContactsQuestion.module";
import { JQWidgetModule } from "../jqWidet.module";
import { MaterialShareModule } from "../materialshare.module";
import { TranslaterModule } from "../translater.module";
import { AccountOnboardingConfigurationComponent } from "./account-onboarding/account-onboarding-configuration/account-onboarding-configuration.component";
import { AccountOnboardingComponent } from "./account-onboarding/account-onboarding.component";
import { AccountAddressComponent } from "./new-account/new-account-components/account-address/account-address.component";
import { AccountEmailsComponent } from "./new-account/new-account-components/account-emails/account-emails.component";
import { AccountAttributeComponent } from "./new-account/new-account-components/account-attribute/account-attribute.component";
import { AccountChargeAddComponent } from "./new-account/new-account-components/account-charge-add/account-charge-add.component";
import { AccountChargeComponent } from "./new-account/new-account-components/account-charge/account-charge.component";
import { AccountContactComponent } from "./new-account/new-account-components/account-contact/account-contact.component";
import { AccountContractCommitmentComponent } from "./new-account/new-account-components/account-contract-commitment/account-contract-commitment.component";
import { AccountContractComponent } from "./new-account/new-account-components/account-contract/account-contract.component";
import { AccountIdentificationComponent } from "./new-account/new-account-components/account-identification/account-identification.component";
import { AccountDetailsComponent } from "./new-account/new-account-components/account-details/account-details.component";
import { AccountOptionsComponent } from "./new-account/new-account-components/account-options/account-options.component";
import { NewAccountPlanComponent } from "./new-account/new-account-components/account-plan/account-plan.component";
import { AccountSiteComponent } from "./new-account/new-account-components/account-site/account-site.component";
import { AccountDocumentComponent } from './new-account/new-account-components/account-document/account-document.component';
import { AccountPaymentComponent } from './new-account/new-account-components/account-payment/account-payment.component';
import { AccountPhoneComponent } from './new-account/new-account-components/account-phone/account-phone.component';
import { AccountNewCostCentersComponent } from './new-account/new-account-components/account-new-cost-centers/account-new-cost-centers.component';
import { AccountServiceGroupsComponent } from './new-account/new-account-components/account-service-groups/account-service-groups.component';
import { AccountSitesComponent } from './new-account/new-account-components/account-sites/account-sites.component';
import { AccountAuthenticationComponent } from './new-account/new-account-components/account-authentication/account-authentication.component';
import { AccountNamesComponent } from "./new-account/new-account-components/account-names/account-names.component";
import { AccountLeftSideMenuComponent } from "./new-account/new-account-components/account-left-side-menu/account-left-side-menu.component";
import { NewAccountComponent } from "./new-account/new-account.component";
import { AccountPlanModule } from "../Plan/History/Account/account-plan.module";
import { ValidationInputComponent } from "./new-account/new-account-components/validation-input/validation-input.component";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
        ContactQuestionsModule,
        ComponentsModule,
        NgxCurrencyModule,
        AccountPlanModule,
    ],
    exports: [
        AccountOnboardingConfigurationComponent,
        AccountDetailsComponent,
        NewAccountComponent,
        AccountOptionsComponent,
        AccountAddressComponent,
        AccountEmailsComponent,
        AccountIdentificationComponent,
        NewAccountPlanComponent,
        AccountContractComponent,
        AccountContractCommitmentComponent,
        AccountContactComponent,
        AccountSiteComponent,
        AccountAttributeComponent,
        AccountChargeComponent,
        AccountChargeAddComponent,
        AccountOnboardingComponent,
        AccountDocumentComponent,
        AccountPaymentComponent,
        AccountPhoneComponent,
        AccountAuthenticationComponent,
        AccountNewCostCentersComponent,
        AccountServiceGroupsComponent,
        AccountSitesComponent,
        AccountNamesComponent,
    ],
    declarations: [
        AccountOnboardingConfigurationComponent,
        AccountDetailsComponent,
        NewAccountComponent,
        AccountOptionsComponent,
        AccountAddressComponent,
        AccountEmailsComponent,
        AccountIdentificationComponent,
        NewAccountPlanComponent,
        AccountContractComponent,
        AccountContractCommitmentComponent,
        AccountContactComponent,
        AccountSiteComponent,
        AccountAttributeComponent,
        AccountChargeComponent,
        AccountChargeAddComponent,
        AccountOnboardingComponent,
        AccountDocumentComponent,
        AccountPaymentComponent,
        AccountPhoneComponent,
        AccountLeftSideMenuComponent,
        AccountAuthenticationComponent,
        AccountNewCostCentersComponent,
        AccountServiceGroupsComponent,
        AccountSitesComponent,
        AccountNamesComponent,
        ValidationInputComponent
    ],
    providers: [
    ]
})

export class AccountsModule { }