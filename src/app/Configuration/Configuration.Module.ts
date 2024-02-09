import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "../jqWidet.module";
import { MaterialShareModule } from "../materialshare.module";
import { TranslaterModule } from "../translater.module";
import { AddressConfigurationComponent } from "./address-configuration/address-configuration.component";
import { AddressConfigurationService } from "./address-configuration/services/address-configuration.service";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { EmailConfigurationComponent } from "./email-configuration/email-configuration.component";
import { EmailConfigurationService } from "./email-configuration/services/email-configuration.service";
import { PasswordComponent } from "./password/password.component";
import { PasswordResetComponent } from "./password-reset/password-reset.component";
import { PasswordConfigurationService } from "./password/services/password-configuration.service";
import { ServiceProviderUserComponent } from "./service-provider-user/service-provider-user.component";
import { ServiceProviderUserConfigurationService } from "./service-provider-user/services/sevice-provider-user.service";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslaterModule,
        MaterialShareModule,
        JQWidgetModule,
    ],
    exports: [
        EmailConfigurationComponent,
        ServiceProviderUserComponent,
        PasswordComponent,
        PasswordResetComponent,
        ChangePasswordComponent,
        AddressConfigurationComponent,
    ],
    declarations: [
        EmailConfigurationComponent,
        ServiceProviderUserComponent,
        PasswordComponent,
        PasswordResetComponent,
        ChangePasswordComponent,
        AddressConfigurationComponent,
    ],
    providers: [
        EmailConfigurationService,
        ServiceProviderUserConfigurationService,
        PasswordConfigurationService,
        ChangePasswordComponent,
        AddressConfigurationService,
    ]
})

export class ConfigurationModule { }