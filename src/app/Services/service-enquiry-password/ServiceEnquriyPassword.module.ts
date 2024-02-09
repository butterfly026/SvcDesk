import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { ServiceEnquiryPasswordComponent } from "./service-enquiry-password.component";

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        IonicModule,
        MaterialShareModule,
        TranslaterModule,
        JQWidgetModule,
    ],
    declarations: [
        ServiceEnquiryPasswordComponent,
    ],
    exports: [
        ServiceEnquiryPasswordComponent,
    ]
})

export class ServiceEnquiryPasswordModule { }