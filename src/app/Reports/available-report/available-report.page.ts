import { AfterContentChecked, Component, OnInit, ViewChild } from '@angular/core';
import { LoadingService, ToastService, TranService } from 'src/services';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AvailableReportService } from './services/available-report.service';
import { AvailableReport } from './interfaces/available-report';
import { GlobalService } from 'src/services/global-service.service';


@Component({
    selector: 'app-available-report',
    templateUrl: './available-report.page.html',
    styleUrls: ['./available-report.page.scss'],
})
export class AvailableReportPage implements OnInit, AfterContentChecked {


    @ViewChild('availableReportGrid') public availableReportGrid: jqxGridComponent;

    private availableReportList: Array<AvailableReport> = [];

    public 
    public gridWidth: string | number = '100%';


    public selectedAvailableReport: AvailableReport;

    private source = {
        localdata: [],
        datafields: [
            { name: 'id', type: 'number' },
            { name: 'reportName', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'command', type: 'string' },
        ],
        datatype: 'array'
    };


    public dataAdapter: any = new jqx.dataAdapter(this.source);


    public columns: Array<any> = [
        { text: 'id', datafield: 'id', widthPx: 80, widthPercent: 20 },
        { text: 'report_name', datafield: 'reportName', widthPx: 200, widthPercent: 30 },
        { text: 'description', datafield: 'description', widthPx: 200, widthPercent: 50 },
    ];


    constructor(
        public navCtrl: NavController,
        private toast: ToastService,
        private loading: LoadingService,
        private tranService: TranService,
        private availableReportService: AvailableReportService,
        public globService: GlobalService,
    ) {

        this.tranService.translaterService();
        this.translateColumns();

        
        this.retrieveAvailableReports();
    }

    ngOnInit(): void {
    }

    scrollContent(event) {
        this.globService.resetTimeCounter();
    }


    ngAfterContentChecked(): void {

    }


    private async retrieveAvailableReports() {

        await this.loading.present();

        this.availableReportService.getAvailableReportList()
            .subscribe(
                result => {
                    this.source.localdata = this.availableReportList = result;
                    this._afterDataLoaded();
                },
                async error => {
                    this._handleError(error.message);
                    await this.loading.dismiss();
                }
            );
    };


    public selectReport = (report: AvailableReport): void => {
        this.navCtrl.navigateForward(report.command);
    };


    private _afterDataLoaded = (): void => {

        // this.pageRowNumberLimit = Math.ceil(this.totalRecords / this.rowToBeShow);

        // this.availableReportGrid.updatebounddata();
        setTimeout(() => this.loading.dismiss(), 100);
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
