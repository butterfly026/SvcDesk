import { Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Paging } from 'src/app/model';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { SpinnerService } from 'src/app/Shared/services';
import { AlertService } from 'src/services/alert-service.service';
import { StringOrDatePipe } from 'src/app/Shared/pipes';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { ServiceNotesService } from './services';
import { Note } from './models';
import { DialogComponent } from 'src/app/Shared/components';
import { ServiceNotesDetailsComponent, ServiceNotesEditComponent, ServiceNotesNewComponent } from './components';

@Component({
  selector: 'app-service-notes',
  templateUrl: './service-notes.component.html',
  styleUrls: ['./service-notes.component.scss'],
})
export class ServiceNotesComponent implements OnChanges, OnDestroy {

  @Input() ContactCode: string = '';
  @Input() ServiceReference: string = '';


  @Output('ContactsNoteComponent') ContactsNoteComponent: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('inputNotes') inputNotes: ElementRef;

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
    private serviceNoteService: ServiceNotesService,
    private alertService: AlertService,
    private tranService: TranService,
    private globService: GlobalService,
    private dialog: MatDialog,
    @Inject(StringOrDatePipe) private stringOrDatePipe: StringOrDatePipe
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ServiceReference?.currentValue) {
      this.csvFileName = this.tranService.instant('ServiceNotes') + ' ' + this.ServiceReference;
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
    this.serviceNoteService.deleteServiceNote(event.Id)
    .pipe(takeUntil(this.unsubscribeAll$))
    .subscribe({
      next: () => this.getServiceNotes(),
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
        component: ServiceNotesNewComponent,
        contactCode: this.ServiceReference
      }
    });
    this.dialogRef.afterClosed().subscribe(res => {
      if(res === 'ok') {
        this.getServiceNotes();
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
        component: ServiceNotesDetailsComponent,
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
        component: ServiceNotesEditComponent,
        note: event
      }
    });
    this.dialogRef.afterClosed().subscribe(res => {
      if(res === 'ok') {
        this.getServiceNotes();
      }
    });
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.spinnerService.loading();
    this.getServiceNotes();
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Services/Notes', "").replace('/', "") as PermissionType);
  }

  private getServiceNotes(): void {
    this.serviceNoteService.getServiceNotes(this.eventParam, this.ServiceReference)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result) => {
          this.spinnerService.end();
          if (result === null) {
            this.tranService.errorMessage('NoServiceNotes');
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
    this.globService.getAuthorization('/Services/Notes', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result: Permission[]) => {
          this.formatPermissions(result);
          if (this.permissions.includes('')) {
            this.getServiceNotes();
          } else {
            this.spinnerService.end();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => this.ContactsNoteComponent.emit('go-back'), 1000);
          }
        },
        error: (error) => {
          this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(error);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            this.alertService.closeAllAlerts();
            setTimeout(() => this.ContactsNoteComponent.emit('go-back'), 1000);
          }
        }
      });
  }

}
