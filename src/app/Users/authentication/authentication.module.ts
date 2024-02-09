import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { ResetPasswordModule } from "../reset-password/reset-password.module";
import { AuthenticationComponent } from "../authentication/authentication.component";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
        ResetPasswordModule,
    ],
    declarations: [
        AuthenticationComponent,
    ],
    exports: [
        AuthenticationComponent,
    ]
})

export class AuthenticationModule { }