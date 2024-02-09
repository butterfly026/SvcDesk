import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { TemplatesComponent } from "./templates.component";
import { TemplateFormComponent } from "./template-form/template-form.component";
import { TemplateListComponent } from "./template-list/template-list.component";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
        PaginationModule,
    ],
    declarations: [
        TemplatesComponent,
        TemplateListComponent,
        TemplateFormComponent
    ],
    exports: [
      TemplatesComponent,
        TemplateListComponent,
        TemplateFormComponent
    ]
})

export class TemplatsModule { }




