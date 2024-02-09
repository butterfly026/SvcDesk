import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { DatatableAction, PermissionType, SearchOption } from 'src/app/Shared/models';
import { ServiceChangesService } from './services/service-changes.service';
import { ServiceChangeDetail } from './service-changes.page.type';

@Component({
  selector: 'app-service-changes',
  templateUrl: './service-changes.page.html',
  styleUrls: ['./service-changes.page.scss'],
})
export class ServiceChangesPage implements OnInit {

  @Input() ContactCode: string = '';
  @Output('ServiceChangesComponent') public ServiceChangesComponent: EventEmitter<string> = new EventEmitter<string>();

  fromList = [
    { tranText: '', text: 'no_selected', value: 0 },
    { tranText: '', text: 'last_7_days', value: 7 },
    { tranText: '', text: 'last_30_days', value: 30 },
    { tranText: '', text: 'last_90_days', value: 90 },
    { tranText: '', text: 'last_6_months', value: 180 },
    { tranText: '', text: 'last_a_year', value: 365 },
  ];

  ChangeId: string = '';
  From: string = '';
  fromValue: number = 0;

  totalCount: number;
  dataSource: ServiceChangeDetail[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  eventParam = new Paging();
  permissions: PermissionType[] = ['Download'];
  csvFileName = "Service Changes ";
  columns = ['ChangeType', 'From', 'Count'];
  searchOptions: SearchOption[] = ['Text', 'From'];
  showSearchOptions: boolean = false;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private loading: LoadingService,
    private serService: ServiceChangesService,
    private globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
    for (let list of this.fromList) {
      this.tranService.convertText(list.text).subscribe(result => {
        list.tranText = result;
      });
    }
  }

  ngOnInit(): void {
    this.setFromValue('no_selected');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!!changes.ContactCode.currentValue) {
      this.csvFileName += changes.ContactCode.currentValue;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  processChanges(event): void {
    this.ServiceChangesComponent.emit(event);
  }

  dblclickRow(event: ServiceChangeDetail): void {
    if (event.ChangeType && event.From) {
      if (this.ChangeId !== event.ChangeType) {
        this.ChangeId = event.ChangeType;
      }
    }
  }

  setFromValue(text): void {
    let currentDate = new Date();
    switch (text) {
      case 'no_selected':
        this.From = this.globService.getDateTimeWithString('YYYY-MM-DD', new Date('01/01/1990'));
        break;
      case 'last_7_days':
        currentDate.setDate(currentDate.getDate() - 7);
        this.From = this.globService.getDateTimeWithString('YYYY-MM-DD', currentDate);
        break;
      case 'last_30_days':
        currentDate.setDate(currentDate.getDate() - 30);
        this.From = this.globService.getDateTimeWithString('YYYY-MM-DD', currentDate);
        break;
      case 'last_90_days':
        currentDate.setDate(currentDate.getDate() - 90);
        this.From = this.globService.getDateTimeWithString('YYYY-MM-DD', currentDate);
        break;
      case 'last_6_months':
        currentDate.setMonth(currentDate.getMonth() - 6);
        this.From = this.globService.getDateTimeWithString('YYYY-MM-DD', currentDate);
        break;
      case 'last_a_year':
        currentDate.setFullYear(currentDate.getFullYear() - 1);
        this.From = this.globService.getDateTimeWithString('YYYY-MM-DD', currentDate);
        break;
      default:
        break;
    }
    this.getServiceChangeList();
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getServiceChangeList();
  }

  private async getServiceChangeList(): Promise<void> {
    await this.loading.present();
    const reqData = {
      ...this.eventParam,
      From: this.From,
    }
    this.serService.getChangesList(this.ContactCode, reqData)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(async result => {
        await this.loading.dismiss();
        
        if (result === null) {
          this.tranService.errorMessage('no_services');
        } else {
          this.dataSource = result;
          this.totalCount = result.length;
        }

      }, async error => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
  }

  toggleSearchOptions(){
    this.showSearchOptions = !this.showSearchOptions;
    if(!this.showSearchOptions){
      this.setFromValue('no_selected');
    }
  }
}

