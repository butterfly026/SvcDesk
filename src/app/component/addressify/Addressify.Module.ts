import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { AddressifyComponent } from "./addressify.component";

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
        AddressifyComponent,
    ],
    declarations: [
        AddressifyComponent,
    ]
})

export class AddressifyModule { }