import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { SharedModule } from "src/app/Shared/shared.module";
import { DiscountEditService } from "../discount-edit/services/discount-edit.service";
import { DiscountComponentComponent } from "./discount-component.component";
import { DiscountEditComponent } from "./discount-edit/discount-edit.component";
import { DiscountListComponent } from "./discount-list/discount-list.component";
import { DiscountListService } from "./discount-list/services/discount-list-service";
import { DiscountNewComponent } from "./discount-new/discount-new.component";
import { DiscountNewService } from "./discount-new/services/discount-new-service";
import { DiscountDetailsComponent } from "./discount-details/discount-details.component";

@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        TranslaterModule,
        MaterialShareModule,
        JQWidgetModule,
        SharedModule
    ],
    exports: [
        DiscountComponentComponent,
        DiscountListComponent,
        DiscountEditComponent,
        DiscountNewComponent,
    ],
    declarations: [
        DiscountComponentComponent,
        DiscountListComponent,
        DiscountEditComponent,
        DiscountNewComponent,
        DiscountDetailsComponent
    ],
    providers: [
        DiscountEditService,
        DiscountListService,
        DiscountNewService,
    ]
})

export class DiscountComponentsModule { }