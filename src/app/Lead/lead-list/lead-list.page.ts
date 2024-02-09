import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
    ToastService, LoadingService, TranService
} from 'src/services';
import { LeadListService } from './services/lead-list.service';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { Subscription } from 'rxjs';
import { GlobalService } from 'src/services/global-service.service';


@Component({
    selector: 'app-lead-list',
    templateUrl: './lead-list.page.html',
    styleUrls: ['./lead-list.page.scss'],
})
export class LeadListPage implements OnInit, AfterContentChecked {


    @ViewChild('leadListGrid') public leadListGrid: jqxGridComponent;

    leadList = [];

    public rowList: Array<number> = [10, 20, 50, 100];
    
    public pageTitle: string;
    public gridWidth: string | number = '100%';

    public pageRowNumber: number = 1;
    public pageRowNumberLimit: number = 1;
    public rowToBeShow: number = 10;
    public startIndex: number = 1;
    public endIndex: number = 10;

    source = {
        localdata: [],
        datafields: [
            { name: 'id', type: 'int' },
            { name: 'status', type: 'string' },
            { name: 'source', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'contact_number', type: 'string' },
            { name: 'details', type: 'string' }
        ],
        datatype: 'array',
        pagesize: 10
    };


    public dataAdapter: any = new jqx.dataAdapter(this.source);


    public columns: Array<any> = [
        { text: 'id', datafield: 'id', widthPx: 50, widthPercent: 5 },
        { text: 'status', datafield: 'status', widthPx: 100, widthPercent: 10 },
        { text: 'source', datafield: 'source', widthPx: 100, widthPercent: 10 },
        { text: 'name', datafield: 'name', widthPx: 150, widthPercent: 20 },
        { text: 'contact_number', datafield: 'contact_number', widthPx: 150, widthPercent: 20 },
        { text: 'details', datafield: 'details', widthPx: 300, widthPercent: 35 }
    ];


    constructor(
        public navCtrl: NavController,
        private toast: ToastService,
        private loading: LoadingService,
        private tranService: TranService,
        private leadListService: LeadListService,
        public globService: GlobalService,
    ) {

        this.tranService.translaterService();

    }


    async ngOnInit() {
        await this.loading.present();
        this.translateColumns();

        

        this.leadListService.getSalesLeadList()
            .subscribe(
                async result => {
                    this.source.localdata = this.leadList = result.data;
                    await this.loading.dismiss();
                },
                async error => {
                    this._handleError(error.message);
                    await this.loading.dismiss();
                }
            );

        this.tranService.convertText('Lead')
            .subscribe(value => {
                this.pageTitle = value;
            });

    }

    scrollContent(event) {
        this.globService.resetTimeCounter();
    }


    ngAfterContentChecked(): void {

        // this.pageRowNumberLimit = this.leadListGrid.getpaginginformation().pagescount;
    }


    objectDisaply = () => {
        this.source.localdata = [];
        setTimeout(() => this.source.localdata = this.leadList, 50);
    };


    public myGridOnPageChanged = (event: any): void => {

        this.startIndex = event.args.owner._startboundindex + 1;
        this.endIndex = event.args.owner._endboundindex + 1;
        this.pageRowNumber = event.args.pagenum + 1;

    };


    public getPageIndex = (): void => {

        setTimeout(() => {
            this.startIndex = this.leadListGrid.widgetObject['_startboundindex'] + 1;
            this.endIndex = this.leadListGrid.widgetObject['_endboundindex'] + 1;
        }, 50);

    };


    public myGridOnPageSizeChanged = (event: any): void => {
        
    };


    private _handleError = (message: string): Subscription =>
        this.tranService.convertText(message)
            .subscribe(
                value => this.toast.present(value)
            );


    private translateColumns = () =>
        this.columns.forEach((obj, idx) => {
            this.tranService.convertText(obj.text).subscribe(
                text => this.columns[idx].text = text,
            );
        });


}
