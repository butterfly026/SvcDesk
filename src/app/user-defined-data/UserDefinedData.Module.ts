import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "../jqWidet.module";
import { MaterialShareModule } from "../materialshare.module";
import { TranslaterModule } from "../translater.module";
import { UserDefinedDataFormService } from "./user-defined-data-form/services/user-defined-data-form.service";
import { UserDefinedDataFormComponent } from "./user-defined-data-form/user-defined-data-form.component";
import { UserDefinedDataListService } from "./user-defined-data-list/services/user-defined-data-list.service";
import { UserDefinedDataListComponent } from "./user-defined-data-list/user-defined-data-list.component";
import { UserDefinedDataComponent } from "./user-defined-data.component";
import { SharedModule } from "../Shared/shared.module";

@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
        SharedModule,
    ],
    exports: [
        UserDefinedDataComponent,
        UserDefinedDataFormComponent,
        UserDefinedDataListComponent,
    ],
    declarations: [
        UserDefinedDataComponent,
        UserDefinedDataFormComponent,
        UserDefinedDataListComponent,
    ],
    providers: [
        UserDefinedDataListService,
        UserDefinedDataFormService,
    ]
})

export class UserDefinedDataModule { }