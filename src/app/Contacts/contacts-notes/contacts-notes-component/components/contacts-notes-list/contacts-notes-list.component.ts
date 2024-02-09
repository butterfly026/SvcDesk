import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges, OnDestroy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { StringOrDatePipe } from 'src/app/Shared/pipes';
import { SpinnerService } from 'src/app/Shared/services';
import { Paging } from 'src/app/model';
import { AlertService } from 'src/services/alert-service.service';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ContactsNotesService } from '../../services';
import { Note } from '../../models';
import { ContactsNotesDetailsComponent, ContactsNotesEditComponent, ContactsNotesNewComponent } from '..';
import { DialogComponent } from 'src/app/Shared/components';

@Component({
  selector: 'app-contacts-notes-list',
  templateUrl: './contacts-notes-list.component.html',
  styleUrls: ['./contacts-notes-list.component.scss'],
})
export class ContactsNotesListComponent implements OnChanges, OnDestroy {

  @Input() ContactCode: string = '';
  @Output('ContactsNotesListComponent') ContactsNotesListComponent: EventEmitter<string> = new EventEmitter<string>();


  totalCount: number = 0;
  dataSource: Note[] = [];
  dataTableAction: DatatableAction = { row: ['Details', 'Update', 'Delete'], toolBar: [ 'Create', 'Refresh', 'ExportExcel'] };
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
    private contactsNoteService: ContactsNotesService,
    private alertService: AlertService,
    private tranService: TranService,
    private globService: GlobalService,
    private dialog: MatDialog,
    @Inject(StringOrDatePipe) private stringOrDatePipe: StringOrDatePipe
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

  deleteSelectedOne(event: any): void {
    this.spinnerService.loading();
    this.contactsNoteService.deleteContactNotes(event.Id)
    .pipe(takeUntil(this.unsubscribeAll$))
    .subscribe({
      next: () => this.getContactNotes(),
      error: error => {
        this.spinnerService.end();
        this.tranService.errorMessage(error);
      }
    });
  }

  addNew(): void {
    this.dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '390px',
      panelClass: 'dialog',
      data: {
        component: ContactsNotesNewComponent,
        contactCode: this.ContactCode
      }
    });
    this.dialogRef.afterClosed().subscribe(res => {
      if(res === 'ok') {
        this.getContactNotes();
      }
    });
  }

  goToNoteDetail(event: any): void {
    this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '390px',
      panelClass: 'dialog',
      data: {
        component: ContactsNotesDetailsComponent,
        note: event
      }
    });
  }

  editOne(event: any): void {
    this.dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '390px',
      panelClass: 'dialog',
      data: {
        component: ContactsNotesEditComponent,
        note: event
      }
    });
    this.dialogRef.afterClosed().subscribe(res => {
      if(res === 'ok') {
        this.getContactNotes();
      }
    });
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.spinnerService.loading();
    this.getContactNotes();
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Contacts/Notes', "").replace('/', "") as PermissionType);
  }

  private getContactNotes(): void {
    this.contactsNoteService.ContactNotes(this.eventParam, this.ContactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result) => {
          this.spinnerService.end();
          if (result === null) {
            this.tranService.errorMessage('no_contacts_note');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Notes.map(s => ({
              ...s, 
              RevokedRowActionPermissions: s.Editable ? null : 'Update',
              Body: `
                <ion-row class="ion-justify-content-between mb-2">
                  <span>${s.CreatedBy}&nbsp;&nbsp;&nbsp;</span>
                  <span>${this.stringOrDatePipe.transform(s.Created, 'YYYY-MM-DD hh:mm:ss')}&nbsp;&nbsp;&nbsp;</span>
                </ion-row>
                ${s.Body}
              ` 
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
    this.globService.getAuthorization('/Contacts/Notes', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result: Permission[]) => {
          this.formatPermissions(result);
          if (this.permissions.includes('')) {
            this.getContactNotes();
          } else {
            this.spinnerService.end();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => this.ContactsNotesListComponent.emit('go-back'), 1000);
          }
        },
        error: (error) => {
          this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(error);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            this.alertService.closeAllAlerts();
            setTimeout(() => this.ContactsNotesListComponent.emit('go-back'), 1000);
          }
        }
      });
  }

}
