import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { PaginationModule } from "src/app/component/paging-component/pagination.module";
import { JQWidgetModule } from "src/app/jqWidet.module";
import { MaterialShareModule } from "src/app/materialshare.module";
import { TranslaterModule } from "src/app/translater.module";
import { ResponsiveGridDirective } from "./usage-detail/directives/responsive-grid.directive";
import { UsageDetailService } from "./usage-detail/services/usage-detail.service";
import { UsageDetailComponent } from "./usage-detail/usage-detail.component";
import { UsageHistoryService } from "./usage-history/services/usage-history.service";
import { UsageHistoryComponent } from "./usage-history/usage-history.component";
import { SharedModule } from "src/app/Shared/shared.module";
import { UsageComponentsFormComponent } from "./usage-components-form/usage-components-form.component";
@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        MaterialShareModule,
        JQWidgetModule,
        TranslaterModule,
        PaginationModule,
        SharedModule,
    ],
    exports: [
        UsageDetailComponent,
        UsageHistoryComponent,
    ],
    declarations: [
        UsageDetailComponent,
        UsageHistoryComponent,
        UsageComponentsFormComponent,
    ],
    providers: [
        UsageHistoryService,
        UsageDetailService,
        ResponsiveGridDirective,
    ]
})

export class UsageServiceModule { }