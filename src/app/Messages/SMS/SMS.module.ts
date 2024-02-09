import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { SMSListService } from "./sms-list/services/sms-list-service";
import { SmsListComponent } from "./sms-list/sms-list.component";
import { SMSSendService } from "./sms-send/services/sms-send-service";
import { SmsSendComponent } from "./sms-send/sms-send.component";
import { SMSService } from "./sms/services/sms.service";
import { SmsPage } from "./sms/sms.page";

@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        TranslaterModule,
        MaterialShareModule,
        JQWidgetModule,
    ],
    exports: [
        SmsListComponent,
        SmsSendComponent,
        SmsPage,
    ],
    declarations: [
        SmsListComponent,
        SmsSendComponent,
        SmsPage,
    ],
    providers: [
        SMSListService,
        SMSSendService,
        SMSService
    ]
})

export class SMSModule { }