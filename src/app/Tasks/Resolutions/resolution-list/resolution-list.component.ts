import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { TaskResolutionListService } from './services/resolution-list.service';

@Component({
  selector: 'app-task-resolution-list',
  templateUrl: './resolution-list.component.html',
  styleUrls: ['./resolution-list.component.scss'],
})
export class ResolutionListComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('ResolutionListComponent') ResolutionListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  @ViewChild('taskResolutionGrid') taskResolutionGrid: jqxGridComponent;

  groupList: any[] = [];

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  source = {
    localdata: [],
    datafields: [
      { name: 'id', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'active', type: 'string' },
      { name: 'display_order', type: 'string' },
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
    { datafield: 'name', text: '' },
    { datafield: 'active', text: '' },
    { datafield: 'display_order', text: '' },
    { datafield: 'created_by', text: '' },
    { datafield: 'created', text: '' },
    { datafield: 'updated_by', text: '' },
    { datafield: 'updated', text: '' }
  ];
  gridRecords: any = {};

  constructor(
    private loading: LoadingService,
    private resolutionService: TaskResolutionListService,
    private tranService: TranService,
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

  async getTasksResolutionList() {
    this.groupList = [];
    await this.loading.present();
    this.resolutionService.getTasksResolutionList().subscribe(async (result: any) => {
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
    this.getTasksResolutionList();
  }

  refreshGrid() {
    this.globService.globSubject.next('refresh-grid');
    this.getTasksResolutionList();
  }

  ngAfterViewInit() {
  }


  getWidth() {
    if (typeof (document.getElementById('tasks-resolution-list-grid')) !== undefined &&
      document.getElementById('tasks-resolution-list-grid') !== null) {
      let element = document.getElementById('tasks-resolution-list-grid') as HTMLInputElement;
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
        this.taskResolutionGrid.refresh();
        this.taskResolutionGrid.render();
      }
      return this.gridWidth;
    } else {
      const tempData = this.gridContentWidth;
      this.gridContentWidth = '100%';
      if (tempData !== '' && tempData !== this.gridContentWidth) {
        this.setGridData();
        this.taskResolutionGrid.refresh();
        this.taskResolutionGrid.render();
      }
      return 'calc(100% - 2px)';
    }
  }

  exportData() {
    this.taskResolutionGrid.exportview('xlsx', 'Customer Tasks Resolution List');
  }

  setGridData() {
    this.source.localdata = [];

    for (const list of this.groupList) {
      const tempData = {
        active: list?.active,
        created: list?.created,
        created_by: list?.createdby,
        display_order: list?.displayorder,
        id: list?.id,
        name: list?.name,
        updated: list?.updated,
        updated_by: list?.updatedby,

      };
      this.source.localdata.push(tempData);
    }

    this.taskResolutionGrid.updatebounddata();

    this.gridRecords = this.taskResolutionGrid.attrSource;
    this.setGridColumnWidth(this.gridRecords.records);
  }


  setGridColumnWidth(list) {
    this.gridWidth = 0;
    let columnsMaxWidth = {
      active: 0,
      created: 0,
      created_by: 0,
      display_order: 0,
      id: 0,
      name: 0,
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
          this.taskResolutionGrid.setcolumnproperty(list.datafield, 'width', result.length * 8 + 10);
          this.gridWidth += result.length * 8 + 10;
        } else {
          this.taskResolutionGrid.setcolumnproperty(list.datafield, 'width', columnsMaxWidth[list.datafield] * 8 + 10);
          this.gridWidth += columnsMaxWidth[list.datafield] * 8 + 10;
        }
      });
    }
  }

  goBack() {
    this.ResolutionListComponent.emit({ type: 'close' });
  }

  goToNew() {
    this.ResolutionListComponent.emit({ type: 'create' });
  }

  goToUpdate() {
    this.ResolutionListComponent.emit({ type: 'update', data: this.selectedData?.id });
  }

  async delelteTaskResolution() {
    await this.loading.present();
    try {
      const result = await this.resolutionService.deleteTaskResolution(this.selectedData.id).toPromise();
      await this.loading.dismiss();
      this.selectedData = null;
      this.getTasksResolutionList();
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }
}
