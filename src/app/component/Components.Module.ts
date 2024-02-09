import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ChangePasswordComponentModule } from "../auth/change-password/change-password-component/change-password.module";
import { JQWidgetModule } from "../jqWidet.module";
import { MaterialShareModule } from "../materialshare.module";
import { TranslaterModule } from "../translater.module";
import { CreateUpdateComponent } from "./create-update/create-update.component";
import { DynamicFormComponent } from "./dynamic-form/dynamic-form.component";
import { HeaderComponent } from "./header/header.component";
import { MenuItemComponent } from "./menu-item/menu-item.component";
import { LanguageModule } from "src/app/select-language/language.module";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
        ChangePasswordComponentModule,
        LanguageModule,
    ],
    exports: [
        CreateUpdateComponent,
        MenuItemComponent,
        DynamicFormComponent,
        HeaderComponent,
    ],
    declarations: [
        CreateUpdateComponent,
        MenuItemComponent,
        DynamicFormComponent,
        HeaderComponent,
    ]
})

export class ComponentsModule { }