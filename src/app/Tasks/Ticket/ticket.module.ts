import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { CKEditorModule } from "ckeditor4-angular";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { TicketFormComponent } from "./ticket-form/ticket-form.component";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
        CKEditorModule,
    ],
    declarations: [
        TicketFormComponent,
    ],
    exports: [
        TicketFormComponent,
    ]
})

export class TicketModule { }