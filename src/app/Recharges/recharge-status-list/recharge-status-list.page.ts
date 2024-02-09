import { AfterContentChecked, Component, OnInit, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { NavController } from '@ionic/angular';
import { LoadingService, ToastService, TranService } from 'src/services';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RechargesStatusService } from './services/recharges-status.service';
import { RechargeStatus } from './models/recharge-status';
import { GlobalService } from 'src/services/global-service.service';

@Component({
    selector: 'app-recharge-status-list',
    templateUrl: './recharge-status-list.page.html',
    styleUrls: ['./recharge-status-list.page.scss'],
})
export class RechargeStatusListPage implements OnInit, AfterContentChecked {

    @ViewChild('rechargesStatusGrid') public rechargesStatusGrid: jqxGridComponent;

    rechargesStatus: Array<RechargeStatus> = [];

    public rowList: Array<number> = [10, 20, 50, 100];
    
    public grTotal: string;
    public gridWidth: string | number = '100%';

    public pageRowNumber: number = 1;
    public pageRowNumberLimit: number = 1;
    public rowToBeShow: number = 10;
    public startIndex: number = 1;
    public endIndex: number = 10;
    public selectedRecharge: RechargeStatus;
    // public dealerId: string;

    source = {
        localdata: [],
        datafields: [
            { name: 'Id', type: 'number' },
            { name: 'Description', type: 'string' },
            { name: 'CreatedBy', type: 'string' },
            { name: 'CreatedDatetime', type: 'date' },
            { name: 'UpdatedBy', type: 'string' },
            { name: 'LastUpdatedDatetime', type: 'date' }
        ],
        datatype: 'array',
        pagesize: 10
    };


    public dataAdapter: any = new jqx.dataAdapter(this.source);

    public columns: Array<any> = [
        { text: 'id', datafield: 'Id', widthPx: 80, widthPercent: 10 },
        { text: 'description', datafield: 'Description', widthPx: 110, widthPercent: 30 },
        { text: 'created_by', datafield: 'CreatedBy', widthPx: 80, widthPercent: 15 },
        { text: 'created_at', datafield: 'CreatedDatetime', widthPx: 80, widthPercent: 15, cellsformat: 'dd/MM/yyyy HH:mm tt' },
        { text: 'updatedby', datafield: 'UpdatedBy', widthPx: 200, widthPercent: 15 },
        { text: 'last_updated_at', datafield: 'LastUpdatedDatetime', widthPx: 100, widthPercent: 15, cellsformat: 'dd/MM/yyyy HH:mm tt' }
    ];

    _grandTotalText = `<div style="font-size: smaller; line-height: 30px; color: #222428;"><strong>${'Grand Total'}:</strong></div>`;
    _aggregateSum = (aggregates: { sum: string }): string => `<div style="font-size: smaller; line-height: 30px; color: #222428;"><strong>${aggregates.sum}</strong></div>`;


    constructor(
        public navCtrl: NavController,
        private toast: ToastService,
        private loading: LoadingService,
        private tranService: TranService,
        private rechargesStatusService: RechargesStatusService,
        private activatedRoute: ActivatedRoute,
        public globService: GlobalService,
    ) {

        this.tranService.translaterService();

        // this.dealerId = activatedRoute.snapshot.params['dealer_id'];
    }


    async ngOnInit() {
        await this.loading.present();
        this.translateColumns();

        

        this.rechargesStatusService.getRechargesList()
            .subscribe(
                async result => {
                    this.source.localdata = this.rechargesStatus = result;
                    this.rechargesStatusGrid.updatebounddata();
                    await this.loading.dismiss();
                },
                async error => {
                    this._handleError(error.message);
                    await this.loading.dismiss();
                }
            );

        this.tranService.convertText('grand_total').subscribe(value => {
            this.grTotal = value;
        });
    }

    scrollContent(event) {
        this.globService.resetTimeCounter();
    }


    ngAfterContentChecked(): void {

        // this.pageRowNumberLimit = this.rechargesStatusGrid.getpaginginformation().pagescount;
    }


    public myGridOnPageChanged = (event: any): void => {

        this.startIndex = event.args.owner._startboundindex + 1;
        this.endIndex = event.args.owner._endboundindex + 1;
        this.pageRowNumber = event.args.pagenum + 1;

    };


    public getPageIndex = (): void => {

        setTimeout(() => {
            this.startIndex = this.rechargesStatusGrid.widgetObject['_startboundindex'] + 1;
            this.endIndex = this.rechargesStatusGrid.widgetObject['_endboundindex'] + 1;
        }, 50);

    };


    public myGridOnPageSizeChanged = (event: any): void => {
        
    };


    private _handleError = (message: string): Subscription =>
        this.tranService.convertText(message)
            .subscribe(
                value => this.toast.present(value)
            );


    private translateColumns = (): void => this.columns.forEach((obj, idx) => {
        this.tranService.convertText(obj.text).subscribe(text => this.columns[idx].text = text);
    });
}
