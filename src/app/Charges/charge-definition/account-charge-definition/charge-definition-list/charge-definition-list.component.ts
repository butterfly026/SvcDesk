import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, ToastService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ChargeDefinitionListService } from './services/definition-list.service';

@Component({
  selector: 'app-charge-definition-list',
  templateUrl: './charge-definition-list.component.html',
  styleUrls: ['./charge-definition-list.component.scss'],
})
export class ChargeDefinitionListComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('ChargeDefinitionListComponent') ChargeDefinitionListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  @ViewChild('chargeDefinitionGrid') chargeDefinitionGrid: jqxGridComponent;

  groupList: any[] = [];

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  deleteMessage: string = '';
  disableUpdate = false;
  disableEnd = false;
  ChargeCode: string = '';

  source = {
    localdata: [],
    datafields: [
      { name: 'advance_periods', type: 'string' },
      { name: 'anniversary_type', type: 'string' },
      { name: 'anniversary_type_id', type: 'string' },
      { name: 'bill_description', type: 'string' },
      { name: 'charge_in_advance', type: 'string' },
      { name: 'consolidate', type: 'string' },
      { name: 'cost', type: 'number' },
      { name: 'cost_based_price_type', type: 'string' },
      { name: 'created', type: 'string' },
      { name: 'created_by', type: 'string' },
      { name: 'default_price', type: 'number' },
      { name: 'display_order', type: 'string' },
      { name: 'frequency', type: 'string' },
      { name: 'frequency_id', type: 'string' },
      { name: 'group_text', type: 'string' },
      { name: 'group_id', type: 'string' },
      { name: 'id', type: 'string' },
      { name: 'invoice_group', type: 'string' },
      { name: 'invoice_group_id', type: 'string' },
      { name: 'last_updated', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'print_on_invoice', type: 'string' },
      { name: 'prorated', type: 'string' },
      { name: 'service_provider_code', type: 'string' },
      { name: 'standard_price', type: 'number' },
      { name: 'type', type: 'string' },
      { name: 'unit', type: 'string' },
      { name: 'updated_by', type: 'string' }
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { datafield: 'id', text: '' },
    { datafield: 'name', text: '' },
    { datafield: 'bill_description', text: '' },
    { datafield: 'default_price', text: '', cellsformat: 'c2', cellsalign: 'right', },
    { datafield: 'standard_price', text: '', cellsformat: 'c2', cellsalign: 'right', },
    { datafield: 'frequency', text: '' },
    { datafield: 'frequency_id', text: '' },
    { datafield: 'charge_in_advance', text: '' },
    { datafield: 'advance_periods', text: '' },
    { datafield: 'prorated', text: '' },
    { datafield: 'unit', text: '' },
    { datafield: 'service_provider_code', text: '' },
    { datafield: 'group_id', text: '' },
    { datafield: 'group_text', text: '' },
    { datafield: 'anniversary_type_id', text: '' },
    { datafield: 'anniversary_type', text: '' },
    { datafield: 'consolidate', text: '' },
    { datafield: 'display_order', text: '' },
    { datafield: 'print_on_invoice', text: '' },
    { datafield: 'invoice_group_id', text: '' },
    { datafield: 'invoice_group', text: '' },
    { datafield: 'cost', text: '', cellsformat: 'c2', cellsalign: 'right', },
    { datafield: 'type', text: '' },
    { datafield: 'cost_based_price_type', text: '' },
    { datafield: 'created_by', text: '' },
    { datafield: 'created', text: '' },
    { datafield: 'last_updated', text: '' },
    { datafield: 'updated_by', text: '' }
  ];
  gridRecords: any = {};

  chargeParam = {
    SearchString: '',
    SkipRecords: 0,
    TakeRecords: 10,
    CountRecords: 'Y',
    CurrentOnly: true,
    AccountOnly: false,
  };


  totalLength: any;
  pageRowNumber: number = 1;
  rowStep: string = '10';
  SkipRecords: number = 0;

  endForm: UntypedFormGroup;
  endFormMinDate: any;

  constructor(
    private loading: LoadingService,
    private toast: ToastService,
    private chargeService: ChargeDefinitionListService,
    private tranService: TranService,

    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.tranService.translaterService();
    this.endForm = this.formBuilder.group({
      endDate: ['', Validators.required]
    });

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
    this.chargeService.getChargeList(this.chargeParam).subscribe(async (result: any) => {
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_charges');
      } else {
        for (const list of convResult.items) {
          this.groupList.push(list);
        }
        this.totalLength = convResult.count;
        this.setGridData();
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  outPagingComponent(event) {
    this.chargeParam.SkipRecords = event.SkipRecords;
    this.chargeParam.TakeRecords = event.TakeRecords;

    this.pageRowNumber = event.pageRowNumber;
    this.rowStep = event.rowStep;
    this.SkipRecords = event.SkipRecords;

    this.getChargeList();
  }

  searchInputEvent(event) {
    if (event.keyCode === 13) {
      this.chargeParam.SearchString = event.target.value;
      this.chargeParam.SkipRecords = 0;
      this.chargeParam.TakeRecords = 10;
      this.pageRowNumber = 1;
      this.rowStep = '10';
      this.SkipRecords = 0;
      this.getChargeList();
    }
  }

  ngOnInit() {
    this.getChargeList();
  }

  refreshGrid() {
    this.chargeParam.SkipRecords = 0;
    this.chargeParam.TakeRecords = 10;
    this.pageRowNumber = 1;
    this.rowStep = '10';
    this.globService.globSubject.next('refresh-grid');
    this.getChargeList();
  }

  ngAfterViewInit() {
  }


  getWidth() {
    if (typeof (document.getElementById('charge-definition-list-grid')) !== undefined &&
      document.getElementById('charge-definition-list-grid') !== null) {
      let element = document.getElementById('charge-definition-list-grid') as HTMLInputElement;
      return element.offsetWidth;
    } else {
      return 900;
    }
  }

  async selectRow(event) {
    if (event.args.row.id) {
      this.disableUpdate = true;
      this.selectIndex = event.args.row.boundindex;
      this.selectedData = this.groupList[this.selectIndex];
      this.ChargeCode = this.selectedData.id;
      const ongoingStr = await this.tranService.convertText('on_going').toPromise();
      if (event.args.row.charge_to === 'On-going' || event.args.row.charge_to === ongoingStr ||
        new Date(this.selectedData.to).getTime() >= new Date(this.selectedData.from).getTime()) {
        this.disableEnd = true;
      } else {
        this.disableEnd = false;
      }
    } else {
      this.disableEnd = false;
      this.disableUpdate = false;
    }
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
    this.chargeDefinitionGrid.exportview('xlsx', 'Customer Charge List');
  }

  setGridData() {
    this.source.localdata = [];

    for (const list of this.groupList) {
      const tempData = {
        advance_periods: list?.advanceperiods,
        anniversary_type: list?.anniversarytype,
        anniversary_type_id: list?.anniversarytypeid,
        bill_description: list?.billdescription,
        charge_in_advance: list?.chargeinadvance,
        consolidate: list?.consolidate,
        cost: list?.cost,
        cost_based_price_type: list?.costbasedpricetype,
        created: list?.created,
        created_by: list?.createdby,
        default_price: list?.defaultprice,
        display_order: list?.displayorder,
        frequency: list?.frequency,
        frequency_id: list?.frequencyid,
        group_text: list?.group,
        group_id: list?.groupid,
        id: list?.id,
        invoice_group: list?.invoicegroup,
        invoice_group_id: list?.invoicegroupid,
        last_updated: list?.lastupdated,
        name: list?.name,
        print_on_invoice: list?.printoninvoice,
        prorated: list?.prorated,
        service_provider_code: list?.serviceprovidercode,
        standard_price: list?.standardprice,
        type: list?.type,
        unit: list?.unit,
        updated_by: list?.updatedby

      };
      this.source.localdata.push(tempData);
    }

    this.chargeDefinitionGrid.updatebounddata();

    this.gridRecords = this.chargeDefinitionGrid.attrSource;
    this.setGridColumnWidth(this.gridRecords.records);
  }


  setGridColumnWidth(list) {

    this.gridWidth = 0;
    let columnsMaxWidth = {
      advance_periods: 0,
      anniversary_type: 0,
      anniversary_type_id: 0,
      bill_description: 0,
      charge_in_advance: 0,
      consolidate: 0,
      cost: 0,
      cost_based_price_type: 0,
      created: 0,
      created_by: 0,
      default_price: 0,
      display_order: 0,
      frequency: 0,
      frequency_id: 0,
      group_text: 0,
      group_id: 0,
      id: 0,
      invoice_group: 0,
      invoice_group_id: 0,
      last_updated: 0,
      name: 0,
      print_on_invoice: 0,
      prorated: 0,
      service_provider_code: 0,
      standard_price: 0,
      type: 0,
      unit: 0,
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
          this.chargeDefinitionGrid.setcolumnproperty(list.datafield, 'width', result.length * 8 + 10);
          this.gridWidth += result.length * 8 + 10;
        } else {
          this.chargeDefinitionGrid.setcolumnproperty(list.datafield, 'width', columnsMaxWidth[list.datafield] * 8 + 10);
          this.gridWidth += columnsMaxWidth[list.datafield] * 8 + 10;
        }
      });
    }
  }

  goBack() {
    this.ChargeDefinitionListComponent.emit({ type: 'close' });
  }

  goToNew() {
    this.ChargeDefinitionListComponent.emit({ type: 'create' });
  }

  goToUpdate() {
    this.ChargeDefinitionListComponent.emit({ type: 'chargeUpdate', data: this.selectedData });
  }

  delelteCharge() {
  }

  async confirmDelete() {
    await this.loading.present();
    try {
      const result = await this.chargeService.deleteCharge(this.selectedData.id).toPromise();
      await this.loading.dismiss();
      this.getChargeList();
    } catch (error) {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    }

  }

  cancelDelete() {
  }

}
