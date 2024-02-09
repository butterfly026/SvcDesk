import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { ServiceAttributeFormComponent } from "./service-attribute-form/service-attribute-form.component";
import { ServiceAttributeListComponent } from "./service-attribute-list/service-attribute-list.component";
import { ServiceAttributeComponent } from "./service-attribute/service-attribute.component";
import { ServiceAttributeInstanceDetailsComponent } from "./service-attribute-instance-details/service-attribute-instance-details.component";
import { SharedModule } from "src/app/Shared/shared.module";

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
    declarations: [
        ServiceAttributeComponent,
        ServiceAttributeListComponent,
        ServiceAttributeFormComponent,
        ServiceAttributeInstanceDetailsComponent,        
    ],
    exports: [
        ServiceAttributeComponent,
        ServiceAttributeListComponent,
        ServiceAttributeFormComponent,
        ServiceAttributeInstanceDetailsComponent,
    ]
})

export class ServiceAttributeModule { }