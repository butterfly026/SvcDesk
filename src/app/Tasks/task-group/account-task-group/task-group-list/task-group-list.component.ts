import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { TaskGroupListService } from './services/task-group-list.service';

@Component({
  selector: 'app-task-group-list',
  templateUrl: './task-group-list.component.html',
  styleUrls: ['./task-group-list.component.scss'],
})
export class TaskGroupListComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('TaskGroupListComponent') TaskGroupListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  @ViewChild('taskGroupsGrid') taskGroupsGrid: jqxGridComponent;

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
    private groupService: TaskGroupListService,
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

  async getTasksGroupList() {
    this.groupList = [];
    await this.loading.present();
    this.groupService.getTasksGroupList().subscribe(async (result: any) => {
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
    if (typeof (document.getElementById('tasks-group-list-grid')) !== undefined &&
      document.getElementById('tasks-group-list-grid') !== null) {
      let element = document.getElementById('tasks-group-list-grid') as HTMLInputElement;
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
        this.taskGroupsGrid.refresh();
        this.taskGroupsGrid.render();
      }
      return this.gridWidth;
    } else {
      const tempData = this.gridContentWidth;
      this.gridContentWidth = '100%';
      if (tempData !== '' && tempData !== this.gridContentWidth) {
        this.setGridData();
        this.taskGroupsGrid.refresh();
        this.taskGroupsGrid.render();
      }
      return 'calc(100% - 2px)';
    }
  }

  exportData() {
    this.taskGroupsGrid.exportview('xlsx', 'Customer Tasks Group List');
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
        updated_by: list?.updatedby

      };
      this.source.localdata.push(tempData);
    }

    this.taskGroupsGrid.updatebounddata();

    this.gridRecords = this.taskGroupsGrid.attrSource;
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
          this.taskGroupsGrid.setcolumnproperty(list.datafield, 'width', result.length * 8 + 10);
          this.gridWidth += result.length * 8 + 10;
        } else {
          this.taskGroupsGrid.setcolumnproperty(list.datafield, 'width', columnsMaxWidth[list.datafield] * 8 + 10);
          this.gridWidth += columnsMaxWidth[list.datafield] * 8 + 10;
        }
      });
    }
  }

  goBack() {
    this.TaskGroupListComponent.emit({ type: 'close' });
  }

  goToNew() {
    this.TaskGroupListComponent.emit({ type: 'create' });
  }

  goToUpdate() {
    this.TaskGroupListComponent.emit({ type: 'update', data: this.selectedData?.id });
  }

  async delelteTaskGroup() {
    await this.loading.present();
    try {
      const result = await this.groupService.deleteTaskGroup(this.selectedData.id).toPromise();
      await this.loading.dismiss();
      this.selectedData = null;
      this.getTasksGroupList();
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }
  }

}
