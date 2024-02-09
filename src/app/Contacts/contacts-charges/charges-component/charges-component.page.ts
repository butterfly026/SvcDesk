import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ChargeProfile } from 'src/app/model';
import { LoadingService, ToastService, TranService } from 'src/services';

import { GlobalService } from 'src/services/global-service.service';
import { ChargesService } from './services/charges.service';

@Component({
  selector: 'app-charges-component',
  templateUrl: './charges-component.page.html',
  styleUrls: ['./charges-component.page.scss'],
})
export class ChargesComponentPage implements OnInit, AfterViewInit {


  @Input() ContactCode: string = '';
  @Output('ChargesListComponent') ChargesListComponent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('myGridChargeList') myGridChargeList: jqxGridComponent;

  pageState: string = 'list';

  chargeList: any[] = [];

  

  debitRunTitle = '';

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  pageTitle: string = '';

  deleteStr = '';

  deleteMessage: string = '';
  disableUpdate = true;

  source = {
    localdata: [],
    datafields: [
      { name: 'id', type: 'string', },
      { name: 'source', type: 'string', },
      { name: 'status', type: 'string', },
      { name: 'code', type: 'string', },
      { name: 'description', type: 'string', },
      { name: 'provider_code', type: 'string', },
      { name: 'from', type: 'string', },
      { name: 'to', type: 'string', },
      { name: 'inviced_to', type: 'string', },
      { name: 'bill_description', type: 'string', },
      { name: 'default_price', type: 'string', },
      { name: 'type', type: 'string', },
      { name: 'plan', type: 'string', },
      { name: 'planoption', type: 'string', },
      { name: 'planid', type: 'string', },
      { name: 'planoptionid', type: 'string', },
      { name: 'reference', type: 'string', },
      { name: 'frequency', type: 'string', },
      { name: 'unit', type: 'string', },
      { name: 'quantity', type: 'string', },
      { name: 'prorated', type: 'string', },
      { name: 'editable', type: 'string', },
      { name: 'chargeinadvance', type: 'string', },
      { name: 'advanceperiods', type: 'string', },
      { name: 'discount_based', type: 'string', },
      { name: 'attribute_based', type: 'string', },
      { name: 'auto_source_id', type: 'string', },
      { name: 'geo_based', type: 'string', },
      { name: 'display_end_date', type: 'string', },
      { name: 'cost', type: 'string', },
      { name: 'overrideid', type: 'string', },
      { name: 'override_price', type: 'string', },
      { name: 'over_mark_up', type: 'string', },
      { name: 'external_source', type: 'string', },
      { name: 'revenueaccount', type: 'string', },
      { name: 'externaltablename', type: 'string', },
      { name: 'externaltransactionid', type: 'string', },
      { name: 'customer_reference', type: 'string', },
      { name: 'other_reference', type: 'string', },
      { name: 'etf', type: 'string', },
      { name: 'created_by', type: 'string', },
      { name: 'created', type: 'string', },
      { name: 'lastupdated', type: 'string', },
      { name: 'updatedby', type: 'string', },
    ],
    datatype: 'array'
  };
  dataAdapter: any = new jqx.dataAdapter(this.source);
  columns = [
    { text: '', datafield: 'id', width: 60 },
    { text: '', datafield: 'source', width: 70 },
    { text: '', datafield: 'status', width: 70 },
    { text: '', datafield: 'code', width: 50 },
    { text: '', datafield: 'description', width: 90 },
    { text: '', datafield: 'provider_code', width: 110 },
    { text: '', datafield: 'from', width: 50 },
    { text: '', datafield: 'to', width: 50 },
    { text: '', datafield: 'inviced_to', width: 90 },
    { text: '', datafield: 'bill_description', width: 120 },
    { text: '', datafield: 'default_price', cellsalign: 'right', width: 120 },
    { text: '', datafield: 'type', width: 50 },
    { text: '', datafield: 'plan', width: 50 },
    { text: '', datafield: 'planoption', width: 100 },
    { text: '', datafield: 'planid', width: 70 },
    { text: '', datafield: 'planoptionid', width: 120 },
    { text: '', datafield: 'reference', width: 80 },
    { text: '', datafield: 'frequency', width: 80 },
    { text: '', datafield: 'unit', width: 50 },
    { text: '', datafield: 'quantity', width: 70 },
    { text: '', datafield: 'prorated', width: 70 },
    { text: '', datafield: 'editable', width: 70 },
    { text: '', datafield: 'chargeinadvance', width: 150 },
    { text: '', datafield: 'advanceperiods', width: 120 },
    { text: '', datafield: 'discount_based', width: 120 },
    { text: '', datafield: 'attribute_based', width: 120 },
    { text: '', datafield: 'auto_source_id', width: 120 },
    { text: '', datafield: 'geo_based', width: 90 },
    { text: '', datafield: 'display_end_date', width: 130 },
    { text: '', datafield: 'cost', cellsalign: 'right', width: 90 },
    { text: '', datafield: 'overrideid', width: 100 },
    { text: '', datafield: 'override_price', cellsalign: 'right', width: 130 },
    { text: '', datafield: 'over_mark_up', width: 110 },
    { text: '', datafield: 'external_source', width: 130 },
    { text: '', datafield: 'revenueaccount', width: 130 },
    { text: '', datafield: 'externaltablename', width: 150 },
    { text: '', datafield: 'externaltransactionid', width: 180 },
    { text: '', datafield: 'customer_reference', width: 90 },
    { text: '', datafield: 'other_reference', width: 110 },
    { text: '', datafield: 'etf', width: 100 },
    { text: '', datafield: 'created_by', width: 80 },
    { text: '', datafield: 'created', width: 90 },
    { text: '', datafield: 'lastupdated', width: 110 },
    { text: '', datafield: 'updatedby', width: 100 },
  ];

  gridRecords: any = {};


  constructor(
    private loading: LoadingService,
    private toast: ToastService,
    private chargeService: ChargesService,
    private tranService: TranService,
    
    private cdr: ChangeDetectorRef,
    public globService: GlobalService
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('charge_list').subscribe(value => {
      this.pageTitle = value;
    });
    

    this.setGridWidth();

    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }
  }

  async getChargeList() {
    this.chargeList = [];
    await this.loading.present();
    this.chargeService.getChargeList(this.ContactCode).subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_charges');
      } else {
        const convertResult = this.globService.ConvertKeysToLowerCase(result)
        for (const list of convertResult.items) {
          this.chargeList.push(list);
        }

        this.globService.getGridOptions(result.Items[0]);
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

  ngAfterViewInit() {
  }


  getWidth() {
    let element = document.getElementById('charge-list-grid');
    if (typeof (element) !== 'undefined' && element !== null) {
      return element.offsetWidth;
    } else {
      return 900;
    }
  }

  selectRow(event) {
    this.selectIndex = event.args.row.boundindex;
    this.selectedData = event.args.row;
    // if (this.selectIndex > this.chargeList.length - 1) {
    //   this.disableUpdate = true;
    // } else {
    //   this.disableUpdate = false;
    // }
    this.disableUpdate = false;
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
      return '100%';
    }
  }

  getGridWidth() {
    this.gridWidth = 0;
    for (let i = 0; i < this.columns.length; i++) {
      this.gridWidth = this.gridWidth + this.columns[i].width;
    }
  }

  exportData() {
    this.myGridChargeList.exportview('xlsx', 'Customer Charge List');
  }

  setGridData() {
    for (const list of this.chargeList) {

      const tempData = {
        id: list.id,
        source: list.source,
        status: list.status,
        code: list.code,
        description: list.description,
        provider_code: list.providercode,
        from: list.from,
        to: list.to,
        invoiced_to: list.invoicedto,
        bill_description: list.billdescription,
        default_price: this.globService.getCurrencyConfiguration(list.defaultprice),
        type: list.type,
        plan: list.plan,
        plan_option: list.planoption,
        plan_id: list.planid,
        plan_option_id: list.planoptionid,
        customer_reference: list.customerreference,
        reference: list.reference,
        other_reference: list.otherreference,
        frequency: list.frequency,
        unit: list.unit,
        quantity: list.quantity,
        prorated: list.prorated,
        editable: list.editable,
        charge_in_advance: list.chargeinadvance,
        advance_periods: list.advanceperiods,
        discount_based: list.discountbased,
        attribute_based: list.attributebased,
        auto_source_id: list.autosourceid,
        geo_based: list.geobased,
        display_end_date: list.displayenddate,
        cost: this.globService.getCurrencyConfiguration(list.cost),
        over_ride_id: list.overrideid,
        over_ride_price: this.globService.getCurrencyConfiguration(list.overrideprice),
        over_mark_up: list.overmarkup,
        e_t_f: list.etf,
        external_source: list.externalsource,
        revenue_account: list.revenueaccount,
        external_table_name: list.externaltablename,
        external_transaction_id: list.externaltransactionid,
        created_by: list.createdby,
        created: list.created,
        last_updated: list.lastupdated,
        updated_by: list.updatedby
      }
      this.source.localdata.push(tempData);
    }
    this.myGridChargeList.updatebounddata();

    this.source.localdata.length = 0;

    this.gridRecords = this.myGridChargeList.attrSource;
    this.setGridColumnWidth(this.gridRecords.records);
  }

  setGridColumnWidth(list) {
    this.gridWidth = 0;
    let columnsMaxWidth = {
      id: 0,
      source: 0,
      status: 0,
      code: 0,
      description: 0,
      provider_code: 0,
      from: 0,
      to: 0,
      invoiced_to: 0,
      bill_description: 0,
      default_price: 0,
      type: 0,
      plan: 0,
      plan_option: 0,
      plan_id: 0,
      plan_option_id: 0,
      customer_reference: 0,
      reference: 0,
      other_reference: 0,
      frequency: 0,
      unit: 0,
      quantity: 0,
      prorated: 0,
      editable: 0,
      charge_in_advance: 0,
      advance_periods: 0,
      discount_based: 0,
      attribute_based: 0,
      auto_source_id: 0,
      geo_based: 0,
      display_end_date: 0,
      cost: 0,
      over_ride_id: 0,
      over_ride_price: 0,
      over_mark_up: 0,
      e_t_f: 0,
      external_source: 0,
      revenue_account: 0,
      external_table_name: 0,
      external_transaction_id: 0,
      created_by: 0,
      created: 0,
      last_updated: 0,
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
          this.myGridChargeList.setcolumnproperty(list.datafield, 'width', result.length * 8 + 10);
          this.gridWidth += result.length * 8 + 10;
        } else {
          this.myGridChargeList.setcolumnproperty(list.datafield, 'width', columnsMaxWidth[list.datafield] * 8 + 10);
          this.gridWidth += columnsMaxWidth[list.datafield] * 8 + 10;
        }
      });
    }
  }

  goBack() {
    this.ChargesListComponent.emit('close');
  }

  goToNew() {
    this.pageState = 'new';
  }

  goToUpdate() {
    this.pageState = 'update';
  }

  delelteCharge() {
    this.deleteStr = 'delete';
  }

  confirmDelete() {
    this.deleteStr = '';
  }

  cancelDelete() {
    this.deleteStr = '';
  }

  processNewCharge(event) {
    if (event == 'close' || event == 'submit') {
      this.pageState = 'list';
      this.getChargeList();
    }
  }

  processUpdateCharge(event) {
    if (event == 'close') {
      this.pageState = 'list';
      this.getChargeList();
    }
  }

  backEmptyFromNull(value) {
    if (value === null || value === 'NULL' || value === 'null') {
      return '';
    } else {
      return value;
    }
  }


}
