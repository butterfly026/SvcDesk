import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JQWidgetModule } from 'src/app/jqWidet.module';
import { MaterialShareModule } from 'src/app/materialshare.module';
import { TranslaterModule } from 'src/app/translater.module';
import { HomePage } from './home/home.page';
import { ProudctPage } from './proudct/proudct.page';
import { ContactPage } from './contact/contact.page';
import { ProductCategoryPage } from './product-category/product-category.page';
import { ProductServicePage } from './product-service/product-service.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
    ],
    exports: [
        HomePage,
        ProudctPage,
        ContactPage,
        ProductCategoryPage,
        ProductServicePage,
    ],
    declarations: [
        HomePage,
        ProudctPage,
        ContactPage,
        ProductCategoryPage,
        ProductServicePage,
    ],
    providers: [
    ]
})
export class OrderEntryModule { }
