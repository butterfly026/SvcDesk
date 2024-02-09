import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { CKEditorModule } from "ckeditor4-angular";
import { JQWidgetModule } from "../jqWidet.module";
import { MaterialShareModule } from "../materialshare.module";
import { TranslaterModule } from "../translater.module";
import { HtmlEditorComponent } from "./html-editor.component";

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
    exports: [
        HtmlEditorComponent,
    ],
    declarations: [
        HtmlEditorComponent,
    ]
})

export class HtmlEditorModule { }