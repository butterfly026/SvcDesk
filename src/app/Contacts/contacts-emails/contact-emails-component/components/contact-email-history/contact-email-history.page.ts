import { Component, OnInit, ViewChild, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { ContactEmailHistory } from 'src/app/model';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService, ToastService } from 'src/services';

import * as moment from 'moment';
import { ConvertDateFormatService } from 'src/services/convert-dateformat.service';
import { GlobalService } from 'src/services/global-service.service';
import { ContactEmailsService } from '../../services';
import { DatatableAction, PermissionType } from 'src/app/Shared/models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-contact-email-history',
  templateUrl: './contact-email-history.page.html',
  styleUrls: ['./contact-email-history.page.scss'],
})
export class ContactEmailHistoryPage implements OnInit {

  @ViewChild('ContactEmailHistoryGrid') ContactEmailHistoryGrid: jqxGridComponent;

  @Input() ContactCode: string = '';
  @Output('ContactEmailHistoryComponent') ContactEmailHistoryComponent: EventEmitter<string> = new EventEmitter<string>();

  dataSource: any[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['ExportExcel'] };  
  columns: string[] = [
    'id',
    'emailTypeCode',
    'emailType',
    'emailAddress',
    'fromDateTime',
    'toDateTime',
    'createdBy',
    'createdDateTime',
    'lastUpdatedBy',
    'lastUpdatedDateTime',
  ];
  permissions: PermissionType[] = [];
  csvFileName: string;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private cCPService: ContactEmailsService,
    
    private cdr: ChangeDetectorRef,
    private dateService: ConvertDateFormatService,
    public globService: GlobalService,
  ) {

    this.tranService.translaterService();
    
  }

  ngOnInit() {
    this.csvFileName = this.tranService.instant('Contact Email History') + ' ' + this.ContactCode;
    this.ContactEmailUsageHistory();
  }

  private async ContactEmailUsageHistory(): Promise<void> {
    await this.loading.present();
    this.cCPService.ContactEmailUsageHistory(this.ContactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: any) => {
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('no_emails');
          } else {
            this.dataSource = result;
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      });
  }

  goBack() {
    this.ContactEmailHistoryComponent.emit('close');
  }

}