import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { ResolutionFormComponent } from "./resolution-form/resolution-form.component";
import { ResolutionListComponent } from "./resolution-list/resolution-list.component";
import { ResolutionsComponent } from "./resolutions.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslaterModule,
        MaterialShareModule,
        JQWidgetModule,
    ],
    exports: [
        ResolutionsComponent,
        ResolutionFormComponent,
        ResolutionListComponent,
    ],
    declarations: [
        ResolutionsComponent,
        ResolutionFormComponent,
        ResolutionListComponent,
    ]
})

export class TasksResolutionsModule { }