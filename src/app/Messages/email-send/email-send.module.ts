import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { EmailSendListComponent } from "./email-send-list/email-send-list.component";
import { EmailSendNewComponent } from "./email-send-new/email-send-new.component";
import { EmailSendComponent } from "./email-send.component";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
    ],
    exports: [
        EmailSendComponent,
        EmailSendListComponent,
        EmailSendNewComponent,
    ],
    declarations: [
        EmailSendComponent,
        EmailSendListComponent,
        EmailSendNewComponent,
    ]
})

export class EmailSendModule { }