import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { ContactMessageImageComponent } from "./contact-message-image.component";
import { ImageFormComponent } from "./image-form/image-form.component";
import { ImageListComponent } from "./image-list/image-list.component";

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
        ImageListComponent,
        ImageFormComponent,
        ContactMessageImageComponent,
    ],
    exports: [
        ImageListComponent,
        ImageFormComponent,
        ContactMessageImageComponent,
    ],
    providers: []
})

export class ContactMessageImageModule { }