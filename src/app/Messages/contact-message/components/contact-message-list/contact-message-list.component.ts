import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Paging } from 'src/app/model';
import { TranService } from 'src/services';
import { StringOrDatePipe } from 'src/app/Shared/pipes';
import { SpinnerService } from 'src/app/Shared/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { DialogComponent } from 'src/app/Shared/components';
import { ContactMessageSmsComponent } from '../contact-message-sms/contact-message-sms.component';
import { ContactMessageEmailComponent } from '../contact-message-email/contact-message-email.component';
import { ContactMessage } from '../../models';
import { ContactMessageDetailComponent } from '..';
import { ContactMessageService } from '../../services';

@Component({
  selector: 'app-contact-message-list',
  templateUrl: './contact-message-list.component.html',
  styleUrls: ['./contact-message-list.component.scss'],
})
export class ContactMessageListComponent implements OnChanges, OnDestroy {

  @Input() ContactCode: string = '';
  @Output('MessageListComponent') MessageListComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number = 0;
  dataSource: ContactMessage[] = [];
  dataTableAction: DatatableAction = { row: ['Details', 'Update', 'Delete'], toolBar: [ 'Refresh', 'SMS', 'Email'] };
  csvFileName: string;
  permissions: PermissionType[] = [];
  searchOptions: SearchOption[] = ['Text'];
  columnsUsedForWrap: string[] = ['Body'];
  columns: string[] = ['Body'];

  private dialogRef: MatDialogRef<any>;
  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private spinnerService: SpinnerService,
    private alertService: AlertService,
    private tranService: TranService,
    private globService: GlobalService,
    private messageService: ContactMessageService,
    private dialog: MatDialog,
    private stringOrDatePipe: StringOrDatePipe,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ContactCode?.currentValue) {
      this.csvFileName = this.tranService.instant('ContactsNotes') + ' ' + this.ContactCode;
      this.spinnerService.loading();
      this.getPermission();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  showDetail(event: ContactMessage): void {
    this.dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '600px',
      panelClass: 'dialog',
      data: {
        component: ContactMessageDetailComponent,
        messageId: event.Id
      }
    });
  }

  editOne(event: ContactMessage): void {
  }
  
  deleteSelectedOne(event: ContactMessage): void {
    this.spinnerService.loading();
    this.messageService.deleteMessage(event.Id)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: () => this.getMessagesList(),
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  onSMS(): void {
    this.dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '550px',
      panelClass: 'dialog',
      data: {
        component: ContactMessageSmsComponent,
        contactCode: this.ContactCode
      }
    });
    this.dialogRef.afterClosed().subscribe(res => {
      if(res === 'ok') {
        this.getMessagesList();
      }
    });
  }

  onEmail(): void {
    this.dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '780px',
      panelClass: 'dialog',
      data: {
        component: ContactMessageEmailComponent,
        contactCode: this.ContactCode
      }
    });
    this.dialogRef.afterClosed().subscribe(res => {
      if(res === 'ok') {
        this.getMessagesList();
      }
    });
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.spinnerService.loading();
    this.getMessagesList();
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Contacts/Messages', "").replace('/', "") as PermissionType);
  }

  private formatHTMLEntityCodeString(str): string {
    return str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
  }

  private configColumnBody(val: ContactMessage): string {
    return `
      <ion-row class="justify-content-between">
        <ion-col size="12">
          ${this.tranService.instant(val.Direction == 'OUT' ? 'To' : 'From')}&nbsp;:&nbsp;&nbsp;
          ${val.Addresses.map(t => t + ',').toString()}
        </ion-col>
        <ion-col size="12">
          ${val.Subject ? (this.tranService.instant('subject') + '&nbsp;:&nbsp;&nbsp;' + val.Subject) : ''}
        </ion-col>
        <ion-col size="3">
          ${this.tranService.instant('type')}&nbsp;:&nbsp;&nbsp;${val.Type}
        </ion-col>
        <ion-col size="3">
          ${this.tranService.instant('status')}&nbsp;:&nbsp;&nbsp;${val.Status}
        </ion-col>
        <ion-col size="3">
          ${this.tranService.instant('Created')}&nbsp;:&nbsp;&nbsp;
          ${this.stringOrDatePipe.transform(val.Created, 'YYYY-MM-DD hh:mm:ss')}
        </ion-col>
        <ion-col size="3">
          ${this.tranService.instant('CreatedBy')}&nbsp;:&nbsp;&nbsp;${val.CreatedBy}
        </ion-col>
        <ion-col size="12">
          ${this.tranService.instant('Message')}&nbsp;:<br>
          ${val.BodyFormat === 'TEXT' ? this.formatHTMLEntityCodeString(val.Body) : val.Body}
        </ion-col>
      </ion-row>
    `;
  }

  private getMessagesList(): void {
    this.messageService.getMessageList(this.eventParam, this.ContactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result) => {
          this.spinnerService.end();
          if (result === null) {
            this.tranService.errorMessage('no_contacts_note');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Messages.map(s => ({
              ...s, 
              Body: this.configColumnBody(s)
            }));
          }
        },
        error: (error: any) => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
  }

  private getPermission(): void {
    this.globService.getAuthorization('/Contacts/Messages', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result: Permission[]) => {
          this.formatPermissions(result);
          if (this.permissions.includes('')) {
            this.getMessagesList();
          } else {
            this.spinnerService.end();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => this.MessageListComponent.emit('go-back'), 1000);
          }
        },
        error: (error) => {
          this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(error);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            this.alertService.closeAllAlerts();
            setTimeout(() => this.MessageListComponent.emit('go-back'), 1000);
          }
        }
      });
  }

}
