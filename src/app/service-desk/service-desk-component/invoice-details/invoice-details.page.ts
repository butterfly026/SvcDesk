import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { jqxTreeGridComponent } from 'jqwidgets-ng/jqxtreegrid';
import { NavController } from '@ionic/angular';
import { LoadingService, ToastService, TranService } from 'src/services';
import { Subscription } from 'rxjs';
import { InvoiceDetailService } from './services/invoice_detail.service';
import { GlobalService } from 'src/services/global-service.service';


@Component({
    selector: 'app-invoice-details',
    templateUrl: './invoice-details.page.html',
    styleUrls: ['./invoice-details.page.scss'],
})
export class InvoiceDetailsPage implements OnInit {


    @Input('invoiceData') invoiceDetails: any;
    @ViewChild('invoiceDetailGrid') public invoiceDetailGrid: jqxTreeGridComponent;

    @Output('setComponentValue') public componentValue: EventEmitter<string> = new EventEmitter<string>();
    @Output('invoiceDetail') public invoiceDetail: EventEmitter<any> = new EventEmitter<any>();

    invoiceDetailList: any = [];

    public rowList: Array<number> = [10, 20, 50, 100];

    public navigateTo: string;
    public gridWidth: string | number = '100%';

    public pageRowNumber: number = 1;
    public pageRowNumberLimit: number = 1;
    public rowToBeShow: number = 10;
    public startIndex: number = 1;
    public endIndex: number = 10;

    _invoiceSource: any =
        {
            dataType: 'array',
            dataFields: [
                { name: 'charge_description', type: 'string' },
                { name: 'start_date', type: 'string' },
                { name: 'end_date', type: 'string' },
                { name: 'amount', type: 'number' },
                { name: 'amount_with_tax', type: 'number' },
                { name: 'children', type: 'array' }
            ],
            hierarchy:
            {
                root: 'children'
            },
            localdata: [],
            pageSize: 10
        };

    public selectedInvoiceDetail: any;

    public _invoiceColumn: any = [
        { text: 'charge_description', dataField: 'charge_description', widthPx: 100, widthPercent: 10 },
        { text: 'start_date', dataField: 'start_date', widthPx: 120, widthPercent: 13 },
        { text: 'end_date', dataField: 'end_date', widthPx: 120, widthPercent: 13 },
        { text: 'amount', dataField: 'amount', widthPx: 80, widthPercent: 10, cellsFormat: 'c2', cellsAlign: 'right' },
        { text: 'amount_inc_tax', dataField: 'amount_with_tax', widthPx: 80, widthPercent: 10, cellsFormat: 'c2', cellsAlign: 'right' }
    ];


    public dataAdapter: any = new jqx.dataAdapter(this._invoiceSource);


    constructor(public navCtrl: NavController,
        private invoiceDetailService: InvoiceDetailService,
        private toast: ToastService,
        private loading: LoadingService,
        private tranService: TranService,
        public globService: GlobalService,
    ) {



        this.tranService.translaterService();
    }


    async ngOnInit() {
        await this.loading.present();
        this.translateColumns(this._invoiceColumn);

        this.invoiceDetailService.geInvoiceDetails()
            .subscribe(
                async data => {
                    this._invoiceSource.localdata = this.invoiceDetailList = data;
                    this.invoiceDetailGrid.updateBoundData();
                    await this.loading.dismiss();
                    this._paginationInit();
                },
                async error => {
                    this._handleError(error.message);
                    await this.loading.dismiss();
                }
            );

    }




    public myGridOnPageChanged = (event: any): void => {

        setTimeout(this._paginationInit, 100);

        this.pageRowNumber = event.args.pagenum + 1;
    };


    public getPageIndex = (): void => {

        setTimeout(this._paginationInit, 100);
    };


    public getUsageHistory = (navigateTo: string): void => {
        this.componentValue.emit(navigateTo);
    };


    public myGridOnPageSizeChanged = (event: any): void => {
        
    };

    private _handleError = (message: string): Subscription =>
        this.tranService.convertText(message)
            .subscribe(
                value => this.toast.present(value)
            );


    private _paginationInit = (): void => {
        this.pageRowNumberLimit = Math.ceil(this.invoiceDetailList.length / this.invoiceDetailGrid.attrPageSize);
        this.startIndex = (this.invoiceDetailGrid.attrPageSize * (this.pageRowNumber - 1) + 1);
        this.endIndex = (this.invoiceDetailGrid.attrPageSize * this.pageRowNumber) > this.invoiceDetailList.length ? this.invoiceDetailList.length :
            (this.invoiceDetailGrid.attrPageSize * this.pageRowNumber);
    };


    private translateColumns = (columArray): void => columArray.forEach((obj, idx) => {
        this.tranService.convertText(obj.text).subscribe(text => columArray[idx].text = text);
    });

}
