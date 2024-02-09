import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
import { TranService, LoadingService, ToastService } from 'src/services';
import { ContactsConfigurationService } from './services/contacts-configuration.service';

import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { GlobalService } from 'src/services/global-service.service';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-contacts-configuration-component',
  templateUrl: './contacts-configuration.component.html',
  styleUrls: ['./contacts-configuration.component.scss'],
})
export class ContactsConfigurationComponent implements OnInit {

  @ViewChild('ContactsConfGrid') ContactsConfGrid: jqxGridComponent;

  @Output('ContactsConfigurationComponent') ContactsConfigurationComponent: EventEmitter<string> = new EventEmitter<string>();

  
  groupForm: UntypedFormGroup;
  groupList = [];
  isDisabled: boolean = true;

  pageTitle: string = '';

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  source = {
    localdata: [],
    datafields: [
      { name: 'key', type: 'string', map: '0' },
      { name: 'label', type: 'string', map: '1' },
      { name: 'menu_id', type: 'string', map: '2' },
      { name: 'data_type', type: 'string', map: '3' },
      { name: 'icon_url', type: 'string', map: '4' },
      { name: 'tooltip', type: 'string', map: '5' },
      { name: 'display', type: 'string', map: '6' },
      { name: 'display_order', type: 'string', map: '7' },
      { name: 'display_bold', type: 'string', map: '8' },
      { name: 'display_color', type: 'string', map: '9' },
      { name: 'display_group', type: 'string', map: '10' },
      { name: 'navigation_path', type: 'string', map: '11' },
      { name: 'edit_type', type: 'string', map: '12' },
      { name: 'APIURL', type: 'string', map: '13' },
      { name: 'attribute_type', type: 'string', map: '14' },
      { name: 'object_id', type: 'string', map: '15' },
      { name: 'created_by', type: 'string', map: '16' },
      { name: 'created', type: 'string', map: '17' },
      { name: 'lastupdated', type: 'string', map: '18' },
      { name: 'updatedby', type: 'string', map: '19' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'key', width: 60 },
    { text: '', datafield: 'label', width: 80 },
    { text: '', datafield: 'menu_id', width: 90 },
    { text: '', datafield: 'data_type', width: 100 },
    { text: '', datafield: 'icon_url', width: 100 },
    { text: '', datafield: 'tooltip', width: 100 },
    { text: '', datafield: 'display', width: 100 },
    { text: '', datafield: 'display_order', width: 100 },
    { text: '', datafield: 'display_bold', width: 100 },
    { text: '', datafield: 'display_color', width: 100 },
    { text: '', datafield: 'display_group', width: 100 },
    { text: '', datafield: 'navigation_path', width: 100 },
    { text: '', datafield: 'edit_type', width: 100 },
    { text: '', datafield: 'APIURL', width: 100 },
    { text: '', datafield: 'attribute_type', width: 100 },
    { text: '', datafield: 'object_id', width: 100 },
    { text: '', datafield: 'created_by', width: 100 },
    { text: '', datafield: 'created', width: 100 },
    { text: '', datafield: 'lastupdated', width: 100 },
    { text: '', datafield: 'updatedby', width: 100 },
  ];

  ServiceGroupId: string = '';
  ServiceGroupName: string = '';

  showAddNew: string = '';

  checkValueList: any[] = [];
  configState: boolean = false;
  InitialConfig;

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private cCService: ContactsConfigurationService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private toast: ToastService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    

    this.groupForm = this.formBuilder.group({
    });

    this.setGridWidth();
    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        if (value !== 'buttons') {
          this.columns[i].text = value;
        } else {
          this.columns[i].text = ''
        }
      });
    }

  }

  ngOnInit() {
    this.getList();
  }

  async getList() {

    this.groupList = [];
    await this.loading.present();

    this.cCService.getConfiguratin().subscribe(async (result: any) => {
      
      await this.loading.dismiss();

      if (result === null) {
      } else {

        this.groupList = this.globService.ConvertKeysToLowerCase(result);
        this.setGridData();
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });

  }

  getWidth() {
    let element = document.getElementById('contacts-configuration');
    if (typeof (element) !== 'undefined' && element !== null) {
      return element.offsetWidth;
    } else {
      return 900;
    }
  }

  setGridWidth() {
    this.getGridWidth();
    if (this.getWidth() > this.gridWidth + 32) {
      const tempData = this.gridContentWidth;
      this.gridContentWidth = this.gridWidth + 'px';
      if (tempData !== '' && tempData !== this.gridContentWidth) {
        this.cdr.detectChanges();
        this.setGridData();
      }
      return this.gridWidth;
    } else {
      const tempData = this.gridContentWidth;
      this.gridContentWidth = '100%';
      if (tempData !== '' && tempData !== this.gridContentWidth) {
        this.cdr.detectChanges();
        this.setGridData();
      }
      return 'calc(100% - 2px)';
    }
  }

  getGridWidth() {
    this.gridWidth = 0;
    for (let i = 0; i < this.columns.length; i++) {
      this.gridWidth = this.gridWidth + this.columns[i].width;
    }
  }

  exportData() {
    this.ContactsConfGrid.exportview('xlsx', 'Contact Aliases History');
  }

  setGridData() {
    for (const list of this.groupList) {
      let tempData = [];
      tempData = [
        list.key, list.label, list.menuid, list.datatype, list.iconurl, list.tooltip, list.display, list.displayorder, list.displaybold, list.displaycolor,
        list.displaygroup, list.navigationpath, list.edittype, list.apiurl, list.attributetype, list.objectid, list.createdby,
        this.globService.newDateFormat(list.created), this.globService.newDateFormat(list.lastupdated), list.updatedby
      ];
      this.source.localdata.push(tempData);
    }

    this.ContactsConfGrid.updatebounddata();
    this.source.localdata.length = 0;
    this.ContactsConfGrid.autoresizecolumns();
  }

  goBack() {
    this.ContactsConfigurationComponent.emit('close');
  }

  Rowdoubleclick(event) {
    this.InitialConfig = event.args.row.bounddata;
    this.configState = true;
  }

  processConfiguration(event) {
    if (event === 'close') {
      this.configState = false;
      this.getList();
    }
  }
}
