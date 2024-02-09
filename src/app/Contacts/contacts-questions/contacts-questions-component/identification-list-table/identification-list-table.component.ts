import { Component, Input, OnInit } from '@angular/core';
import { IdentificationItem } from '../../contacts-questions.page.types';
import { DatatableAction, MessageForRowDeletion, PermissionType, SearchOption } from 'src/app/Shared/models';
import { Paging } from 'src/app/model';
import { Subject } from 'rxjs';
import { LoadingService, TranService } from 'src/services';
import { IdentificationService } from '../../services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { MatDialog } from '@angular/material/dialog';
import { IdentificationNewComponent } from '../identification-new/identification-new.component';
import { DialogComponent } from 'src/app/Shared/components';
@Component({
  selector: 'app-identification-list-table',
  templateUrl: './identification-list-table.component.html',
  styleUrls: ['./identification-list-table.component.scss'],
})
export class IdentificationListTableComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() Refresh: Boolean = true;
  @Input() permissions: PermissionType[] = [];

  dataSource: IdentificationItem[] = [];
  totalCount: number;
  expandServiceList = [];
  columns: string[] = [];
  dataTableAction: DatatableAction = { row: ['Update', 'Delete'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };
  _showSearchOption: boolean = false;
  searchOptions: SearchOption[] = [];

  eventParam = new Paging();
  deletionMsg: MessageForRowDeletion = {
    header: '',
    message: ''
  }


  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private Refresh_: Boolean = true;
  csvFileName: string = '';

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private identificationService: IdentificationService,
    private dialog: MatDialog,
    private alertService: AlertService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.configInitialValues();
    this.tranService.convertText('are_you_sure').subscribe(value => {
      this.deletionMsg.header = value;
    });
    this.tranService.convertText('delete_confirm_identification').subscribe(value => {
      this.deletionMsg.message = value;
    });
  }
  private configInitialValues(): void {
    this.columns = [
      'Name',
      'Value',
      'ExpiryDate',
      'IssueDate',
    ];
  }
  ngOnInit() { 
    this.csvFileName = 'Identification Documents - ' + this.ContactCode;
    this.getIdentifications();
  }

  ngOnChanges(): void {
    if (this.Refresh !== undefined && this.Refresh !== this.Refresh_) {
      this.getIdentifications()
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getIdentifications();
  }

  async getIdentifications(){ 
    await this.loading.present();
    this.dataSource = [];
    this.identificationService.getCustomerIdList(this.ContactCode).subscribe(async (result: any) => {
      await this.loading.dismiss();
      if (!result) {
        this.tranService.errorToastMessage('no_identifications');
      } else {
        this.totalCount = result.length;
        this.dataSource = result;
      }
    }, async (error: any) => {
      
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  newIdentification(){

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '450px',
      maxHeight: '350px',
      panelClass: 'dialog',
      data: {
        component: IdentificationNewComponent,
        ContactCode: this.ContactCode,
        Permissions: this.permissions,
        EditMode: 'New',
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res === 'ok') {
        this.getIdentifications();
      }
    });

  }

  updateIdentification(selectedData: IdentificationItem){
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '450px',
      maxHeight: '350px',
      panelClass: 'dialog',
      data: {
        component: IdentificationNewComponent,
        ContactCode: this.ContactCode,
        Permissions: this.permissions,
        EditMode: 'Update',
        Data: selectedData,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res === 'ok') {
        this.getIdentifications();
      }
    });

  }
  async deleteIdentification(selectedData: IdentificationItem){
    await this.loading.present();
    this.identificationService.deleteIdentification(selectedData.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();      
      this.getIdentifications();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }
}
