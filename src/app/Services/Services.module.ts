import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { AddressifyModule } from "../component/addressify/Addressify.Module";
import { ComponentsModule } from "../component/components.module";
import { JQWidgetModule } from "../jqWidet.module";
import { MaterialShareModule } from "../materialshare.module";
import { TranslaterModule } from "../translater.module";
import { PlanChangeConfigurationComponent } from "../Configuration/plan-change-configuration/plan-change-configuration.component";
import { ServiceAddAttributeComponent } from "./service-add-component/service-add-attribute/service-add-attribute.component";
import { ServiceAddChargeComponent } from "./service-add-component/service-add-charge/service-add-charge.component";
import { ServiceAddCostCenterComponent } from "./service-add-component/service-add-cost-center/service-add-cost-center.component";
import { ServiceAddHardwareComponent } from "./service-add-component/service-add-hardware/service-add-hardware.component";
import { ServiceAddRelatedContactComponent } from "./service-add-component/service-add-related-contact/service-add-related-contact.component";
import { ServiceAddComponent } from "./service-add/service-add.component";
import { ServiceAddService } from "./service-add/services/service-add.service";
import { ServiceNotesComponent } from "./service-notes/service-notes.component";
import { ServiceNotesService } from "./service-notes/services";
import { TerminationConfigurationComponent } from "../Configuration/termination-configuration/termination-configuration.component";
import { ServiceOnboardingConfigurationComponent } from "./service-onboarding-configuration/service-onboarding-configuration.component";
import { SharedModule } from "../Shared/shared.module";
import { ServiceNewModule } from "./service-new/service-new.module";
import { ServiceNotesDetailsComponent, ServiceNotesEditComponent, ServiceNotesNewComponent } from "./service-notes/components";
import { ServiceNewMainComponent } from "./service-new/components";

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslaterModule,
        JQWidgetModule,
        MaterialShareModule,
        ComponentsModule,
        AddressifyModule,
        SharedModule,
        ServiceNewModule,
    ],
    exports: [
        ServiceNotesComponent,
        ServiceAddComponent,
        ServiceAddAttributeComponent,
        ServiceAddHardwareComponent,
        ServiceAddChargeComponent,
        ServiceAddCostCenterComponent,
        ServiceAddRelatedContactComponent,
        TerminationConfigurationComponent,
        PlanChangeConfigurationComponent,
        ServiceOnboardingConfigurationComponent,
        ServiceNewMainComponent,
    ],
    declarations: [
        ServiceNotesComponent,
        ServiceAddComponent,
        ServiceAddAttributeComponent,
        ServiceAddHardwareComponent,
        ServiceAddChargeComponent,
        ServiceAddCostCenterComponent,
        ServiceAddRelatedContactComponent,
        TerminationConfigurationComponent,
        PlanChangeConfigurationComponent,
        ServiceOnboardingConfigurationComponent,
        ServiceNotesDetailsComponent,
        ServiceNotesNewComponent,
        ServiceNotesEditComponent,
    ],
    providers: [
        ServiceNotesService,
        ServiceAddService,
    ]
})

export class ServicesModule { }