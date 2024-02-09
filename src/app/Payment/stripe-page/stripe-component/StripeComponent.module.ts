import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { StripeComponentComponent } from './stripe-component.component';
import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { StripeComponentService } from './services/stripe-component-service';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslaterModule,
        MaterialShareModule,
        JQWidgetModule,
        TextMaskModule,
    ],
    declarations: [
        StripeComponentComponent,
    ],
    exports: [
        StripeComponentComponent
    ],
    providers: [
        StripeComponentService,
    ]
})
export class StripeComponentModule { }
