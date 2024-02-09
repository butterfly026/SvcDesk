import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "../jqWidet.module";
import { MaterialShareModule } from "../materialshare.module";
import { TranslaterModule } from "../translater.module";
import { SelectLanguageComponent } from "./select-language.component";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        MaterialShareModule,
        TranslaterModule,
        JQWidgetModule,
    ],
    exports: [
        SelectLanguageComponent,
    ],
    declarations: [
        SelectLanguageComponent,
    ],
})

export class LanguageModule { }