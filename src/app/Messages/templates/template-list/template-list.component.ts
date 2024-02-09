import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, ToastService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { TemplateListService } from './services/template-list.service';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
})
export class TemplateListComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('TemplateListComponent') TemplateListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  @ViewChild('templateListGrid') templateListGrid: jqxGridComponent;

  groupList: any[] = [];

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';
  deleteMessage: string = '';
  disableUpdate = false;
  disableEnd = false;
  ChargeCode: string = '';

  searchRecords:any;

  source = {
    localdata: [],
    datafields: [
      { name: 'id', type: 'number' },
      { name: 'category', type: 'string' },
      { name: 'category_id', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'display_order', type: 'number' },
      { name: 'service_provider_charge_group_id', type: 'string' },
      { name: 'sms', type: 'boolean' },
      { name: 'email', type: 'boolean' },
      { name: 'print', type: 'boolean' },
      { name: 'services', type: 'boolean' },
      { name: 'contacts', type: 'boolean' },    
      { name: 'location', type: 'string' },
      { name: 'body', type: 'string' },
      { name: 'header', type: 'string' }, 
      { name: 'created_by', type: 'string' },
      { name: 'created', type: 'string' },
      { name: 'updated_by', type: 'string' },
      { name: 'updated', type: 'string' }
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { datafield: 'id', text: '' },
    { datafield: 'category', text: '' },
    { datafield: 'categoryId', text: '' },
    { datafield: 'name', text: '' },
    { datafield: 'display_order', text: '' },   
    { datafield: 'sms', text: '' },
    { datafield: 'email', text: '' },
    { datafield: 'print', text: '' },
    { datafield: 'services', text: '' },
    { datafield: 'contacts', text: '' },
    { datafield: 'location', text: '' },
    { datafield: 'body', text: '' },
    { datafield: 'header', text: '' },
    { datafield: 'created_by', text: '' },
    { datafield: 'created', text: '' },
    { datafield: 'updated', text: '' },
    { datafield: 'updated_by', text: '' }

    //child object
    
    // "Documents": [
    //   {
    //     "Id": 0,
    //     "Name": "string"
    //   }
    // ],
  ];
  gridRecords: any = {};

  constructor(
    private loading: LoadingService,
    private toast: ToastService,
    private templateListService: TemplateListService,
    private tranService: TranService,

    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.setGridWidth();

    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }
  }

  async getTemplates() {
    this.groupList = [];
    await this.loading.present();
    this.templateListService.getTemplates('').subscribe(async (result: any) => {
      const convResult = this.globService.ConvertKeysToLowerCase(result);      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_charges_group');
      } else {
        for (const list of convResult) {
          this.groupList.push(list);
        }
        this.setGridData();
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  ngOnInit() {
    this.getTemplates();
  }

  refreshGrid() {
    this.globService.globSubject.next('refresh-grid');
    this.getTemplates();
  }

  ngAfterViewInit() {
  }


  getWidth() {
    if (typeof (document.getElementById('charge-group-list-grid')) !== undefined &&
      document.getElementById('charge-group-list-grid') !== null) {
      let element = document.getElementById('charge-group-list-grid') as HTMLInputElement;
      return element.offsetWidth;
    } else {
      return 900;
    }
  }

  async selectRow(event) {
    this.disableUpdate = false;
    if (event.args.row.group_id) {
      this.disableUpdate = true;
      this.selectIndex = event.args.row.boundindex;
      this.selectedData = this.groupList[this.selectIndex];
      this.ChargeCode = this.selectedData.id;
    } else {
      this.disableUpdate = false;
    }
  }

  setGridWidth() {
    if (this.getWidth() > this.gridWidth) {
      const tempData = this.gridContentWidth;
      this.gridContentWidth = this.gridWidth + 'px';
      if (tempData !== '' && tempData !== this.gridContentWidth) {
        this.setGridData();
        this.templateListGrid.refresh();
        this.templateListGrid.render();
      }
      return this.gridWidth;
    } else {
      const tempData = this.gridContentWidth;
      this.gridContentWidth = '100%';
      if (tempData !== '' && tempData !== this.gridContentWidth) {
        this.setGridData();
        this.templateListGrid.refresh();
        this.templateListGrid.render();
      }
      return 'calc(100% - 2px)';
    }
  }

  exportData() {
    this.templateListGrid.exportview('xlsx', 'Templates List'); // create translation
  }

  setGridData() {
    this.source.localdata = [];

    for (const list of this.groupList) {
      const tempData = {
        created: list?.created,
        created_by: list?.createdby,
        display_order: list?.displayorder,
        group_id: list?.groupid,
        last_updated: list?.lastupdated,
        name: list?.name,
        parent_group_id: list?.parentgroupid,
        service_provider_charge_group_id: list?.serviceproviderchargegroupid,
        updated_by: list?.updatedby
      };
      this.source.localdata.push(tempData);
    }

    this.templateListGrid.updatebounddata();

    this.gridRecords = this.templateListGrid.attrSource;
    this.setGridColumnWidth(this.gridRecords.records);
  }
  setGridColumnWidth(list) {
    this.gridWidth = 0;
    let columnsMaxWidth = {
      created: 0,
      created_by: 0,
      display_order: 0,
      group_id: 0,
      last_updated: 0,
      name: 0,
      parent_group_id: 0,
      service_provider_charge_group_id: 0,
      updated_by: 0
    };

    for (const record of list) {
      for (const key in columnsMaxWidth) {
        if (record[key] && columnsMaxWidth[key] < (record[key]).toString().length) {
          columnsMaxWidth[key] = (record[key]).toString().length;
        }
      }
    }

    for (let list of this.columns) {
      this.tranService.convertText(list.datafield).subscribe(result => {
        if (columnsMaxWidth[list.datafield] < result.length) {
          this.templateListGrid.setcolumnproperty(list.datafield, 'width', result.length * 8 + 10);
          this.gridWidth += result.length * 8 + 10;
        } else {
          this.templateListGrid.setcolumnproperty(list.datafield, 'width', columnsMaxWidth[list.datafield] * 8 + 10);
          this.gridWidth += columnsMaxWidth[list.datafield] * 8 + 10;
        }
      });
    }
  }

  goBack() {
    this.TemplateListComponent.emit({ type: 'close' });
  }

  goToNew() {
    this.TemplateListComponent.emit({ type: 'create' });
  }

  goToUpdate() {
    this.TemplateListComponent.emit({ type: 'templateUpdate', data: this.selectedData?.groupid });
  }

  async delelteTemplate() {
    await this.loading.present();
    try {
      const result = await this.templateListService.deleteTemplate(this.selectedData.groupid).toPromise();
      await this.loading.dismiss();
      this.getTemplates();
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

  searchInputEvent(event) {
    if (event.keyCode === 13) {
      this.searchRecords.CategoryId = event.target.value;
      this.searchRecords.SkipRecords = 0;
      this.searchRecords.TakeRecords = 10;
      this.searchRecords.ListOnly = 10;
      this.searchRecords.CountRecords = 10;
      //this.pageRowNumber = 1;
      //this.rowStep = '10';
      //this.SkipRecords = 0;
      this.getTemplates();
    }
  }
}
