import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, ToastService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ChargeGroupListService } from './services/charge-group-list.service';

@Component({
  selector: 'app-charge-group-list',
  templateUrl: './charge-group-list.component.html',
  styleUrls: ['./charge-group-list.component.scss'],
})
export class ChargeGroupListComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('ChargeGroupListComponent') ChargeGroupListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  @ViewChild('chargeGroupsGrid') chargeGroupsGrid: jqxGridComponent;

  groupList: any[] = [];

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  disableUpdate = false;
  ChargeCode: string = '';

  source = {
    localdata: [],
    datafields: [
      { name: 'group_id', type: 'string' },
      { name: 'parent_group_id', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'display_order', type: 'string' },
      { name: 'service_provider_charge_group_id', type: 'string' },
      { name: 'created_by', type: 'string' },
      { name: 'created', type: 'string' },
      { name: 'updated_by', type: 'string' },
      { name: 'last_updated', type: 'string' }
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { datafield: 'group_id', text: '' },
    { datafield: 'parent_group_id', text: '' },
    { datafield: 'name', text: '' },
    { datafield: 'display_order', text: '' },
    { datafield: 'service_provider_charge_group_id', text: '' },
    { datafield: 'created_by', text: '' },
    { datafield: 'created', text: '' },
    { datafield: 'updated_by', text: '' },
    { datafield: 'last_updated', text: '' }
  ];
  gridRecords: any = {};

  constructor(
    private loading: LoadingService,
    private toast: ToastService,
    private chargeService: ChargeGroupListService,
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

  async getChargeList() {
    this.groupList = [];
    await this.loading.present();
    this.chargeService.getChargeGroupList('').subscribe(async (result: any) => {
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
    this.getChargeList();
  }

  refreshGrid() {
    this.globService.globSubject.next('refresh-grid');
    this.getChargeList();
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
        this.chargeGroupsGrid.refresh();
        this.chargeGroupsGrid.render();
      }
      return this.gridWidth;
    } else {
      const tempData = this.gridContentWidth;
      this.gridContentWidth = '100%';
      if (tempData !== '' && tempData !== this.gridContentWidth) {
        this.setGridData();
        this.chargeGroupsGrid.refresh();
        this.chargeGroupsGrid.render();
      }
      return 'calc(100% - 2px)';
    }
  }

  exportData() {
    this.chargeGroupsGrid.exportview('xlsx', 'Customer Charge Group List');
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

    this.chargeGroupsGrid.updatebounddata();

    this.gridRecords = this.chargeGroupsGrid.attrSource;
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
          this.chargeGroupsGrid.setcolumnproperty(list.datafield, 'width', result.length * 8 + 10);
          this.gridWidth += result.length * 8 + 10;
        } else {
          this.chargeGroupsGrid.setcolumnproperty(list.datafield, 'width', columnsMaxWidth[list.datafield] * 8 + 10);
          this.gridWidth += columnsMaxWidth[list.datafield] * 8 + 10;
        }
      });
    }
  }

  goBack() {
    this.ChargeGroupListComponent.emit({ type: 'close' });
  }

  goToNew() {
    this.ChargeGroupListComponent.emit({ type: 'create' });
  }

  goToUpdate() {
    this.ChargeGroupListComponent.emit({ type: 'chargeUpdate', data: this.selectedData?.groupid });
  }

  async delelteCharge() {
    await this.loading.present();
    try {
      const result = await this.chargeService.deleteChargeGroup(this.selectedData.groupid).toPromise();
      await this.loading.dismiss();
      this.getChargeList();
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

}
