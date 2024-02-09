import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { CodeInputModule } from 'angular-code-input';
import { MultiFactorComponent as MultiFactorComponent } from "./multi-factor-component/multi-factor-component.component";
import { SigninHistoryComponent } from "./signin-history/signin-history.component";
import { RegisterDetailsComponent } from "./register-details/register-details.component";
import { ChangePasswordWarningComponent } from "../change-password-warning/change-password-warning.component";

@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
        CodeInputModule,
    ],
    declarations: [
        ForgotPasswordComponent,
        MultiFactorComponent,
        SigninHistoryComponent,
        RegisterDetailsComponent,
     ChangePasswordWarningComponent
    ],
    exports: [
        ForgotPasswordComponent,
        MultiFactorComponent,
        SigninHistoryComponent,
        RegisterDetailsComponent,
        ChangePasswordWarningComponent,
    ],
    providers: [

    ]
})

export class AuthComponentModule { }