import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "../jqWidet.module";
import { MaterialShareModule } from "../materialshare.module";
import { TranslaterModule } from "../translater.module";
import { EmailSendModule } from "./email-send/email-send.module";
import { FtpConfigurationComponent } from "./ftp-configuration/ftp-configuration.component";
import { FTPConfigurationService } from "./ftp-configuration/services/ftp-configuration.service";
import { SMTPConfigurationService } from "./smpt-configuration/services/smpt-configuration.service";
import { SmptConfigurationComponent } from "./smpt-configuration/smpt-configuration.component";
import { SMSConfigurationService } from "./sms-configuration/services/sms-configuration.service";
import { SmsConfigurationComponent } from "./sms-configuration/sms-configuration.component";
import { SMSModule } from "./SMS/SMS.module";
import { TemplateEditorModule } from "./template-editor/template-editor.module";
import { SharedModule } from "../Shared/shared.module";
import { SafeHtmlPipe, StringOrDatePipe } from "../Shared/pipes";
import { ContactMessageComponent, ContactMessageDetailComponent, ContactMessageEmailComponent, ContactMessageListComponent, ContactMessageSmsComponent } from "./contact-message/components";
import { ContactMessageEmailService, ContactMessageSMSService, ContactMessageService } from "./contact-message/services";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslaterModule,
        MaterialShareModule,
        JQWidgetModule,
        SMSModule,
        EmailSendModule,
        TemplateEditorModule,
        SharedModule
    ],
    exports: [
        ContactMessageComponent,
        ContactMessageListComponent,
        ContactMessageEmailComponent,
        ContactMessageSmsComponent,
        SmsConfigurationComponent,
        SmptConfigurationComponent,
        FtpConfigurationComponent,
    ],
    declarations: [
        ContactMessageComponent,
        ContactMessageListComponent,
        ContactMessageEmailComponent,
        ContactMessageSmsComponent,
        ContactMessageDetailComponent,
        SmsConfigurationComponent,
        SmptConfigurationComponent,
        FtpConfigurationComponent,
    ],
    providers: [
        ContactMessageService,
        ContactMessageEmailService,
        ContactMessageSMSService,
        SMTPConfigurationService,
        FTPConfigurationService,
        SMSConfigurationService
    ]
})

export class MessageModule { }