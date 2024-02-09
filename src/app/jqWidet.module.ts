import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HeaderComponent } from './component/header/header.component';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';



import { jqxGridComponent, jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { jqxInputComponent, jqxInputModule } from 'jqwidgets-ng/jqxinput';
import { jqxButtonComponent, jqxButtonModule } from 'jqwidgets-ng/jqxbuttons';
import { jqxChartComponent, jqxChartModule } from 'jqwidgets-ng/jqxchart';
import { jqxMenuComponent, jqxMenuModule } from 'jqwidgets-ng/jqxmenu';
import { jqxCheckBoxComponent, jqxCheckBoxModule } from 'jqwidgets-ng/jqxcheckbox';
import { jqxTreeGridComponent, jqxTreeGridModule } from 'jqwidgets-ng/jqxtreegrid';
import { jqxTabsComponent, jqxTabsModule } from 'jqwidgets-ng/jqxtabs';
import { jqxListBoxComponent, jqxListBoxModule } from 'jqwidgets-ng/jqxlistbox';
import { jqxTreeComponent, jqxTreeModule } from 'jqwidgets-ng/jqxtree';
import { jqxSplitterComponent, jqxSplitterModule } from 'jqwidgets-ng/jqxsplitter';
import { jqxExpanderComponent, jqxExpanderModule } from 'jqwidgets-ng/jqxexpander';
import { jqxRadioButtonComponent, jqxRadioButtonModule } from 'jqwidgets-ng/jqxradiobutton';
import { jqxSwitchButtonComponent, jqxSwitchButtonModule } from 'jqwidgets-ng/jqxswitchbutton';
import { jqxDropDownListComponent, jqxDropDownListModule } from 'jqwidgets-ng/jqxdropdownlist';

import { jqxComboBoxComponent, jqxComboBoxModule } from 'jqwidgets-ng/jqxcombobox';
import { jqxEditorComponent, jqxEditorModule } from 'jqwidgets-ng/jqxeditor';
import { jqxTooltipComponent, jqxTooltipModule } from 'jqwidgets-ng/jqxtooltip';
import { jqxFileUploadComponent, jqxFileUploadModule } from 'jqwidgets-ng/jqxfileupload';
import { jqxDockingComponent, jqxDockingModule } from 'jqwidgets-ng/jqxdocking';
import { jqxNavigationBarComponent, jqxNavigationBarModule } from 'jqwidgets-ng/jqxnavigationbar';

// import { jqxNavigationBarModule } from 'jqwidgets-ng/jqxnavigationbar';

// jqx.credits = "75CE8878-FCD1-4EC7-9249-BA0F153A5DE8"; // This is for v 7.2.0 or newer
// jqx.credits = "12F129D4-0E1B-44B8-9BBB-BB4CF78CC6BA"; // This is for v7.1.0 or older

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        jqxGridModule, jqxInputModule, jqxButtonModule, jqxChartModule, jqxMenuModule, jqxCheckBoxModule, jqxTreeGridModule, jqxTabsModule,
        jqxListBoxModule, jqxTreeModule, jqxSplitterModule, jqxExpanderModule, jqxRadioButtonModule, jqxSwitchButtonModule, jqxDropDownListModule,
        jqxComboBoxModule, jqxEditorModule, jqxTooltipModule, jqxFileUploadModule, jqxDockingModule, jqxNavigationBarModule,
    ],
    exports: [
        jqxGridModule, jqxInputModule, jqxButtonModule, jqxChartModule, jqxMenuModule, jqxCheckBoxModule, jqxTreeGridModule, jqxTabsModule,
        jqxListBoxModule, jqxTreeModule, jqxSplitterModule, jqxExpanderModule, jqxRadioButtonModule, jqxSwitchButtonModule, jqxDropDownListModule,
        jqxComboBoxModule, jqxEditorModule, jqxTooltipModule, jqxFileUploadModule, jqxDockingModule, jqxNavigationBarModule,
    ],
    declarations: [],
    providers: [],
    bootstrap: []
})
export class JQWidgetModule {
}
