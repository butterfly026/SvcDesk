import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { DepositStatusReponseService } from './services/deposit-list.service';

@Component({
  selector: 'app-deposit-status-list',
  templateUrl: './deposit-status-list.component.html',
  styleUrls: ['./deposit-status-list.component.scss'],
})
export class DepositStatusListComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('DepositStatusListComponent') DepositStatusListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  @ViewChild('depositStatusGrid') depositStatusGrid: jqxGridComponent;

  groupList: any[] = [];

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  source = {
    localdata: [],
    datafields: [
      { name: 'id', type: 'string' },
      { name: 'reason', type: 'string' },
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
    { datafield: 'reason', text: '' },
    { datafield: 'created_by', text: '' },
    { datafield: 'created', text: '' },
    { datafield: 'updated_by', text: '' },
    { datafield: 'updated', text: '' }
  ];
  gridRecords: any = {};

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    public globService: GlobalService,
    private depositService: DepositStatusReponseService,
  ) {
    this.tranService.translaterService();
    this.setGridWidth();

    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }
  }

  async getTasksGroupList() {
    this.groupList = [];
    await this.loading.present();
    this.depositService.getDepositStatusList().subscribe(async (result: any) => {
      const convResult = this.globService.ConvertKeysToLowerCase(result);

      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_data');
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
    this.getTasksGroupList();
  }

  refreshGrid() {
    this.globService.globSubject.next('refresh-grid');
    this.getTasksGroupList();
  }

  ngAfterViewInit() {
  }


  getWidth() {
    if (typeof (document.getElementById('deposit-status-list-grid')) !== undefined &&
      document.getElementById('deposit-status-list-grid') !== null) {
      let element = document.getElementById('deposit-status-list-grid') as HTMLInputElement;
      return element.offsetWidth;
    } else {
      return 900;
    }
  }

  async selectRow(event) {
    this.selectedData = null;
    if (event.args.row.id) {
      this.selectIndex = event.args.row.boundindex;
      this.selectedData = this.groupList[this.selectIndex];
    }
  }

  setGridWidth() {
    if (this.getWidth() > this.gridWidth) {
      const tempData = this.gridContentWidth;
      this.gridContentWidth = this.gridWidth + 'px';
      if (tempData !== '' && tempData !== this.gridContentWidth) {
        this.setGridData();
        this.depositStatusGrid.refresh();
        this.depositStatusGrid.render();
      }
      return this.gridWidth;
    } else {
      const tempData = this.gridContentWidth;
      this.gridContentWidth = '100%';
      if (tempData !== '' && tempData !== this.gridContentWidth) {
        this.setGridData();
        this.depositStatusGrid.refresh();
        this.depositStatusGrid.render();
      }
      return 'calc(100% - 2px)';
    }
  }

  exportData() {
    this.depositStatusGrid.exportview('xlsx', 'Customer Tasks Group List');
  }

  setGridData() {
    this.source.localdata = [];

    for (const list of this.groupList) {
      const tempData = {
        reason: list?.reason,
        created: list?.created,
        created_by: list?.createdby,
        id: list?.id,
        updated: list?.updated,
        updated_by: list?.updatedby

      };
      this.source.localdata.push(tempData);
    }

    this.depositStatusGrid.updatebounddata();

    this.gridRecords = this.depositStatusGrid.attrSource;
    this.setGridColumnWidth(this.gridRecords.records);
  }


  setGridColumnWidth(list) {
    this.gridWidth = 0;
    let columnsMaxWidth = {
      reason: 0,
      created: 0,
      created_by: 0,
      id: 0,
      updated: 0,
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
          this.depositStatusGrid.setcolumnproperty(list.datafield, 'width', result.length * 8 + 10);
          this.gridWidth += result.length * 8 + 10;
        } else {
          this.depositStatusGrid.setcolumnproperty(list.datafield, 'width', columnsMaxWidth[list.datafield] * 8 + 10);
          this.gridWidth += columnsMaxWidth[list.datafield] * 8 + 10;
        }
      });
    }
  }

  goBack() {
    this.DepositStatusListComponent.emit({ type: 'close' });
  }

  goToNew() {
    this.DepositStatusListComponent.emit({ type: 'create' });
  }

  goToUpdate() {
    this.DepositStatusListComponent.emit({ type: 'update', data: this.selectedData?.id });
  }

  async delelteTaskGroup() {
    await this.loading.present();
    try {
      const result = await this.depositService.deleteDepositStatus(this.selectedData.id).toPromise();
      await this.loading.dismiss();
      this.selectedData = null;
      this.getTasksGroupList();
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

}
