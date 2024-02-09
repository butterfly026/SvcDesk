import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ChargeUsageFormComponent } from '../charge-usage-form/charge-usage-form.component';
import { ChargeUsageListService } from './services/usage-list.service';

@Component({
  selector: 'app-charge-usage-list',
  templateUrl: './charge-usage-list.component.html',
  styleUrls: ['./charge-usage-list.component.scss'],
})
export class ChargeUsageListComponent implements OnInit, OnChanges {
  @Input() ContactCode: string = '';
  @Input() ListType: string = '';
  @Input() ChargeData: string = '';
  @Input() ChargeDefinitionData: string = '';
  @Input() UsageData: any[] = [];
  @Output('ChargeUsageListComponent') ChargeUsageListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  @ViewChild('chargeUsageGrid') chargeUsageGrid: jqxGridComponent;

  chargeList: any[] = [];

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  disableUpdate = false;
  source = {
    localdata: [],
    datafields: [
      { name: 'id', type: 'string' },
      { name: 'service_type_id', type: 'string' },
      { name: 'from', type: 'string' },
      { name: 'to', type: 'string' },
      { name: 'price', type: 'number' },
      { name: 'warning_minimum_price', type: 'number' },
      { name: 'warning_maximum_price', type: 'number' },
      { name: 'minimum_price', type: 'number' },
      { name: 'maximum_price', type: 'number' },
      { name: 'cost', type: 'number' },
      { name: 'cost_based_price_calculation_type', type: 'string' },
      { name: 'cost_percentage', type: 'string' },
      { name: 'cost_fixed_amount', type: 'number' },
      { name: 'visible', type: 'string' },
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
    { datafield: 'service_type_id', text: '' },
    { datafield: 'from', text: '' },
    { datafield: 'to', text: '' },
    { datafield: 'price', text: '', cellsformat: 'c2', cellsalign: 'right' },
    { datafield: 'warning_minimum_price', text: '', cellsformat: 'c2', cellsalign: 'right' },
    { datafield: 'warning_maximum_price', text: '', cellsformat: 'c2', cellsalign: 'right' },
    { datafield: 'minimum_price', text: '', cellsformat: 'c2', cellsalign: 'right' },
    { datafield: 'maximum_price', text: '', cellsformat: 'c2', cellsalign: 'right' },
    { datafield: 'cost', text: '', cellsformat: 'c2', cellsalign: 'right' },
    { datafield: 'cost_based_price_calculation_type', text: '' },
    { datafield: 'cost_percentage', text: '' },
    { datafield: 'cost_fixed_amount', text: '', cellsformat: 'c2', cellsalign: 'right' },
    { datafield: 'visible', text: '', hidden: true },
    { datafield: 'created_by', text: '', hidden: true },
    { datafield: 'created', text: '', hidden: true },
    { datafield: 'updated_by', text: '', hidden: true },
    { datafield: 'updated', text: '', hidden: true }
  ];
  gridRecords: any = {};

  constructor(
    private loading: LoadingService,
    private modalCtrl: ModalController,
    private tranService: TranService,
    public globService: GlobalService,
    private chargeService: ChargeUsageListService,
    private cdr: ChangeDetectorRef,
  ) {
    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.UsageData?.currentValue) {
      this.chargeList = changes.UsageData.currentValue;
    }

    this.setGridData();
  }

  updateUsageList(data) {
    if (data?.data) {
      const convResult = this.globService.ConvertKeysToLowerCase(data?.data);
      if (data?.type === 'updateData') {
        for (let list of this.chargeList) {
          if (list.id === convResult.id) {
            list.price = convResult?.defaultvalue;
            list.from = convResult?.from;
            list.maximumprice = convResult?.upperlimit;
            list.minimumprice = convResult?.lowerlimit;
            list.servicetypeid = convResult?.servicetype;
            list.to = convResult?.to;
            list.warningmaximumprice = convResult?.warnabove;
            list.warningminimumprice = convResult?.warnbelow;
          }
        }
      } else if (data?.type === 'addData') {
        const newItem = {
          id: this.getDynamicId(),
          price: convResult?.defaultvalue,
          from: convResult?.from,
          maximumprice: convResult?.upperlimit,
          minimumprice: convResult?.lowerlimit,
          servicetypeid: convResult?.servicetype,
          to: convResult?.to,
          warningmaximumprice: convResult?.warnabove,
          warningminimumprice: convResult?.warnbelow,
        }

        this.chargeList.push(newItem);
      }

      this.setGridData();
    }
  }

  getDynamicId() {
    const randId = Math.floor(Math.random() * 1000);
    let available = true;
    for (let list of this.chargeList) {
      if (randId === list.id) {
        available = false;
      }
    }
    if (available) {
      return randId;
    } else {
      this.getDynamicId();
    }
  }

  async getUsageData() {
    this.chargeList = this.UsageData;
    this.setGridData();
  }

  setGridWidth() {
    if (this.getWidth() > this.gridWidth) {
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

  exportData() {
    this.chargeUsageGrid.exportview('xlsx', 'Finantial Events');
  }

  selectRow(event) {
    this.selectedData = null;
    if (event.args.row.id) {
      this.selectIndex = event.args.rowindex;
      this.selectedData = this.chargeList[this.selectIndex];
    } else {
    }
  }

  getWidth() {
    let element = document.getElementById('charge-usage-grid');
    if (typeof (element) !== 'undefined' && element !== null) {
      return element.offsetWidth;
    } else {
      return 900;
    }
  }

  setGridData() {
    this.source.localdata = [];
    for (const list of this.chargeList) {
      const tempData = {
        cost: list.cost,
        cost_based_price_calculation_type: list.costbasedpricecalculationtype,
        cost_fixed_amount: list.costfixedamount,
        cost_percentage: list.costpercentage,
        created: list.created,
        created_by: list.createdby,
        from: list.from,
        id: list.id,
        maximum_price: list.maximumprice,
        minimum_price: list.minimumprice,
        price: list.price,
        service_type_id: list.servicetypeid,
        to: list.to,
        updated: list.updated,
        updated_by: list.updatedby,
        visible: list.visible,
        warning_maximum_price: list.warningmaximumprice,
        warning_minimum_price: list.warningminimumprice
      };
      this.source.localdata.push(tempData);
    }

    if (this.chargeUsageGrid) {
      this.chargeUsageGrid.updatebounddata();

      this.gridRecords = this.chargeUsageGrid.attrSource;
      this.setGridColumnWidth(this.gridRecords.records);

      this.ChargeUsageListComponent.emit({ type: 'gridList', data: this.chargeList });
      if (!this.UsageData || this.UsageData?.length === 0) {
        this.chargeUsageGrid.hidecolumn('visible');
        this.chargeUsageGrid.hidecolumn('created_by');
        this.chargeUsageGrid.hidecolumn('created');
        this.chargeUsageGrid.hidecolumn('updated_by');
        this.chargeUsageGrid.hidecolumn('updated');
      } else {
        this.chargeUsageGrid.showcolumn('visible');
        this.chargeUsageGrid.showcolumn('created_by');
        this.chargeUsageGrid.showcolumn('created');
        this.chargeUsageGrid.showcolumn('updated_by');
        this.chargeUsageGrid.showcolumn('updated');
      }
    }
  }

  setGridColumnWidth(list) {
    this.gridWidth = 0;
    let columnsMaxWidth = {
      cost: 0,
      cost_based_price_calculation_type: 0,
      cost_fixed_amount: 0,
      cost_percentage: 0,
      created: 0,
      created_by: 0,
      from: 0,
      id: 0,
      maximum_price: 0,
      minimum_price: 0,
      price: 0,
      service_type_id: 0,
      to: 0,
      updated: 0,
      updated_by: 0,
      visible: 0,
      warning_maximum_price: 0,
      warning_minimum_price: 0,
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
          this.chargeUsageGrid.setcolumnproperty(list.datafield, 'width', result.length * 8 + 10);
          this.gridWidth += result.length * 8 + 10;
        } else {
          this.chargeUsageGrid.setcolumnproperty(list.datafield, 'width', columnsMaxWidth[list.datafield] * 8 + 10);
          this.gridWidth += columnsMaxWidth[list.datafield] * 8 + 10;
        }
      });
    }
  }

  async goToNew() {
    // this.ChargeUsageListComponent.emit({ type: 'add' });
    const modal = await this.modalCtrl.create({
      component: ChargeUsageFormComponent,
      componentProps: {
        currentList: this.chargeList,
      }
    });

    modal.onDidDismiss().then((result: any) => {
      if (result) {
        
        this.updateUsageList(result.data);
      }
    });

    await modal.present();
  }

  async goToUpdate() {
    // this.ChargeUsageListComponent.emit({ type: 'update', data: this.selectedData });
    const modal = await this.modalCtrl.create({
      component: ChargeUsageFormComponent,
      componentProps: {
        currentList: this.chargeList,
        ChargeData: this.selectedData,
      }
    });

    modal.onDidDismiss().then((result: any) => {
      if (result) {
        this.updateUsageList(result.data);
      }
    });

    await modal.present();
  }

  delelteCharge() {
    this.chargeList.splice(this.selectIndex, 1);
    this.selectedData = null;
    this.setGridData();
  }

}
