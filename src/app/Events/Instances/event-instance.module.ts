import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { 
    EventInstanceComponent, 
    ContactEventInstanceNew, 
    ContactEventInstancesList, 
    ContactEventInstanceDetailsComponent,
    ContactEventInstanceEdit,
    ServiceEventInstanceListComponent,
    ServiceEventInstanceNewComponent,
    ServiceEventInstanceComponent,
    ServiceEventInstanceDetailsComponent,
    ServiceEventInstanceEdit
} from "./components";
import { SharedModule } from "src/app/Shared/shared.module";

@NgModule({
    imports: [
        IonicModule,
        FormsModule,
        CommonModule,
        TranslaterModule,
        PaginationModule,
        JQWidgetModule,
        MaterialShareModule,
        SharedModule
    ],
    exports: [
        EventInstanceComponent,       
        ContactEventInstancesList,
        ContactEventInstanceNew,
        ServiceEventInstanceComponent,
        ServiceEventInstanceListComponent,
    ],
    declarations: [
        EventInstanceComponent,      
        ContactEventInstancesList,
        ContactEventInstanceNew,
        ContactEventInstanceDetailsComponent,
        ContactEventInstanceEdit,
        ServiceEventInstanceComponent,
        ServiceEventInstanceListComponent,
        ServiceEventInstanceNewComponent,
        ServiceEventInstanceDetailsComponent,
        ServiceEventInstanceEdit
    ],
    providers: []
})

export class EventInstanceModule { }