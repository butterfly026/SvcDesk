import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { BarComponent } from "./bar/bar.component";
import { BarService } from "./bar/services/bar-service";
import { UnBarService } from "./unbar/services/unbar-service";
import { UnbarComponent } from "./unbar/unbar.component";

@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
    ],
    exports: [
        BarComponent,
        UnbarComponent,
    ],
    declarations: [
        BarComponent,
        UnbarComponent,
    ],
    providers: [
        BarService,
        UnBarService
    ]
})

export class BarComponentsModule { }