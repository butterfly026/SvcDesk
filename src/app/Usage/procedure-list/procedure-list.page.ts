import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService, ToastService, TranService } from 'src/services';
import { ProcedureListService } from './services/procedure-list.service';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { Subscription } from 'rxjs';
import { ProcedureList } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
    selector: 'app-procedure-list',
    templateUrl: './procedure-list.page.html',
    styleUrls: ['./procedure-list.page.scss'],
})
export class ProcedureListPage implements OnInit {


    @ViewChild('procedureListGrid') public procedureListGrid: jqxGridComponent;

    public rowList: Array<number> = [10, 20, 50, 100];
    public 

    public pageRowNumber: number = 1;
    public pageRowNumberLimit: number = 1;
    public rowToBeShow: number = 10;
    public startIndex: number = 0;
    public endIndex: number = 10;
    public totalRecords: number = 0;

    source = {
        localdata: [],
        datafields: [
            { name: 'DeviceId', type: 'string' },
            // { name: 'AdditionalInformation', type: 'string' },
            { name: 'ProcedureDateTime', type: 'string' },
            { name: 'Name', type: 'string' }
        ],
        datatype: 'array',
        pagesize: 10,
    };


    public dataAdapter: any = new jqx.dataAdapter(this.source);


    public columns: Array<any> = [
        { text: 'device_id', datafield: 'DeviceId', widthPx: 80, widthPercent: 25 },
        { text: 'name', datafield: 'Name', widthPx: 200, widthPercent: 30 },
        { text: 'date_and_time', datafield: 'ProcedureDateTime', widthPx: 200, widthPercent: 45 },
        // { text: 'description', datafield: 'AdditionalInformation', widthPx: 300, widthPercent: 30 }
    ];

    selectIndex: number;
    selectedData: any;
    gridWidth: any;
    gridContentWidth = '';

    constructor(
        public navCtrl: NavController,
        private toast: ToastService,
        private loading: LoadingService,
        private tranService: TranService,
        private procedureListService: ProcedureListService,
        private cdr: ChangeDetectorRef,
        public globService: GlobalService,
    ) {

        this.tranService.translaterService();
        this.translateColumns();

        
        this.retrieveProceduresRecords({ skipRecords: this.startIndex, takeRecords: this.rowToBeShow });

    }

    ngOnInit(): void {

    }

    scrollContent(event) {
        this.globService.resetTimeCounter();
    }


    public jumpToPage = (pageNumber: number | string): any => {

        const numberValue = ~~pageNumber;

        if (numberValue > 0 && numberValue !== null) {
            if (this.pageRowNumberLimit < numberValue) {
                return this._paginationInit(1);
            }
            this._paginationInit(numberValue);
        }

    };


    public pageResize = (): void => {

        this._paginationInit(this.pageRowNumber);
    };


    public pageChange = (side: string): any => {

        if (side === 'NEXT') {
            return this._paginationInit(this.pageRowNumber = this.pageRowNumber + 1);
        }

        this._paginationInit(this.pageRowNumber = this.pageRowNumber - 1);
    };


    public async exportData(exportType: string) {

        await this.loading.present();

        this._getDataToExport().then(
            (ok) => this.procedureListGrid.exportdata(exportType, 'ProcedureList')
        )
    };


    private async retrieveProceduresRecords(paging: { skipRecords: number, takeRecords: number }) {

        await this.loading.present();

        return this.procedureListService.getProcedureList(paging).subscribe(async result => {
            await this.loading.dismiss();
            
            for (let list of result.data) {
                if (list.ProcedureDateTime.includes('Z')) {
                    list.ProcedureDateTime = list.ProcedureDateTime.replace('Z', '');
                }
                if (list.ProcedureDateTime.includes('T')) {
                    list.ProcedureDateTime = list.ProcedureDateTime.replace('T', ' ');
                }
            }
            this.source.localdata = result.data;
            this.totalRecords = result.recordCount || this.totalRecords;

            this._afterDataLoaded();
        }, async error => {
            this._handleError(error.message);
            await this.loading.dismiss();
        }
        );
    };


    private _paginationInit = (currentPage: number): void => {

        this.startIndex = ((currentPage - 1) * this.rowToBeShow);
        this.endIndex = (currentPage * this.rowToBeShow);
        setTimeout(() => this.pageRowNumber = currentPage, 100);

        this.retrieveProceduresRecords({ skipRecords: this.startIndex, takeRecords: this.rowToBeShow })
    };


    private _afterDataLoaded = (): void => {

        this.pageRowNumberLimit = Math.ceil(this.totalRecords / this.rowToBeShow);

        this.procedureListGrid.updatebounddata();
        setTimeout(() => this.loading.dismiss(), 100);
    };


    private _getDataToExport = (): Promise<any> =>
        this.procedureListService.getProcedureList({ skipRecords: 0, takeRecords: this.totalRecords }).toPromise()
            .then(response => {
                this.source.localdata = response.data;
                this.procedureListGrid.updatebounddata();
                setTimeout(() => this.loading.dismiss(), 100);
            });


    private _handleError = (message: string): Subscription =>
        this.tranService.convertText(message)
            .subscribe(
                value => this.toast.present(value)
            );


    private translateColumns = (): void => this.columns.forEach((obj, idx) => {
        this.tranService.convertText(obj.text).subscribe(text => this.columns[idx].text = text);
    });



    getWidth() {
        let element = document.getElementById('contact-email-history');
        if (typeof (element) !== 'undefined' && element !== null) {
            return element.offsetWidth;
        } else {
            return 900;
        }
    }

    setGridWidth() {
        this.getGridWidth();
        if (this.getWidth() > this.gridWidth + 32) {
            const tempData = this.gridContentWidth;
            this.gridContentWidth = this.gridWidth + 'px';
            if (tempData !== '' && tempData !== this.gridContentWidth) {
                this.cdr.detectChanges();
                this.retrieveProceduresRecords({ skipRecords: this.startIndex, takeRecords: this.rowToBeShow });
            }
            return this.gridWidth;
        } else {
            const tempData = this.gridContentWidth;
            this.gridContentWidth = '100%';
            if (tempData !== '' && tempData !== this.gridContentWidth) {
                this.cdr.detectChanges();
                this.retrieveProceduresRecords({ skipRecords: this.startIndex, takeRecords: this.rowToBeShow });
            }
            return 'calc(100% - 2px)';
        }
    }

    getGridWidth() {
        this.gridWidth = 0;
        for (let i = 0; i < this.columns.length; i++) {
            this.gridWidth = this.gridWidth + this.columns[i].width;
        }
    }

}
