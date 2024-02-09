import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "../jqWidet.module";
import { MaterialShareModule } from "../materialshare.module";
import { TranslaterModule } from "../translater.module";
import { PaymentMethodModalComponent } from "./payment-method-modal/payment-method-modal.component";

@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
    ],
    declarations: [
        PaymentMethodModalComponent,
    ],
    exports: [
        PaymentMethodModalComponent,
    ]
})

export class PaymentMethodModule { }