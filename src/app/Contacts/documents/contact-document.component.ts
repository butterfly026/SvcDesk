import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectorRef, } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AlertController } from '@ionic/angular';
import { LoadingService, TranService, GridService, FileService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { Paging } from 'src/app/model';
import { Subject, of } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ContactDocumentService } from './contact-document-child/services/contact-document-service';
import { ContactDocumentChildComponent } from './contact-document-child/contact-document-child.component';
import { DatatableAction, DocumentDetail, MessageForRowDeletion, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DialogComponent } from 'src/app/Shared/components';
import { DatatableService } from 'src/app/Shared/services';

@Component({
  selector: 'app-contact-document',
  templateUrl: './contact-document.component.html',
  styleUrls: ['./contact-document.component.scss'],
})
export class ContactDocumentComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('ContactDocument') ContactDocument: EventEmitter<string> = new EventEmitter<string>();
  @Input() Refresh: Boolean = true;

  newDocumentConfig = new MatDialogConfig();
  newDocumentDialog: MatDialogRef<ContactDocumentChildComponent, any> | undefined;

  PrefixExcelFileName: string = 'ContactDocument';

  pageTitle: string = '';

  showClose: boolean = true;
  showForm: boolean = true;

  documents: any[] = [];
  docState: string = 'view';

  totalCount: number = 0;
  columns: string[] = [];
  dataTableAction: DatatableAction = { row: ['Download', 'Delete'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };
  searchOptions: SearchOption[] = [];
  _showSearchOption: boolean = false;
  permissions: PermissionType[] = [];
  csvFileName: string = '';

  eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private Refresh_: Boolean = true;

  groupForm: UntypedFormGroup;
  deletionMsg: MessageForRowDeletion = {
    header: '',
    message: ''
  }
  constructor(
    private datatableService: DatatableService,
    private globService: GlobalService,
    private documentService: ContactDocumentService,
    private loading: LoadingService,
    private tranService: TranService,
    private gridService: GridService,
    private fileService: FileService,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService,
    private alertCtrl: AlertController,
    public matDialog: MatDialog
  ) {
    this.configInitialValues();
    this.tranService.convertText('are_you_sure').subscribe(value => {
      this.deletionMsg.header = value;
    });
    this.tranService.convertText('are_you_sure_delete_document').subscribe(value => {
      this.deletionMsg.message = value;
    });
  }

  ngOnInit() {
    this.csvFileName = 'Contact Documents - ' + this.ContactCode;
    this.getPermission();
  }
  ngOnChanges(): void {
    if (this.Refresh !== undefined && this.Refresh !== this.Refresh_) {
      this.getDocuments()
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  processDocuments(event) {
    this.docState = 'view';
    this.getDocuments();
    if (event === 'view') {
      this.showClose = true;
    } else {
      this.showClose = false;
    }
  }
  close() {
    this.ContactDocument.emit('close');
  }

  async getCreateDocPermission() {
    
    const dialogRef = this.matDialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '500px',
      panelClass: 'dialog',
      data: {
        component: ContactDocumentChildComponent,
        ContactCode: this.ContactCode,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'created') {
        this.getDocuments();
      }
    });         

  }

  switchCreateDoc() {
    // this.docState='create'; 
    this.getCreateDocPermission();
  }

  private configInitialValues(): void {
    this.columns = [
      'Id',
      'Name',
      'Category',
      'FileType',
      'Note',
      'Author',
      'DateAuthored',
    ];
  }
  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Contacts/Documents', "").replace('/', "") as PermissionType);
  }
  async getPermission() {
    await this.loading.present();
    this.globService.getAuthorization('/Contacts/Documents', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result) => {
          await this.loading.dismiss();
          this.formatPermissions(_result);
          if (this.permissions.includes('')) {
            this.getDocuments();
          } else {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.close();
            }, 1000);
          }
        },
        error: async (err) => {
          await this.loading.dismiss();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.close();
            }, 1000);
          }
        }
      });
  }
  async getDocuments() {
    await this.loading.present();
    this.documents = [];
    this.documentService.getAllDocuments(this.ContactCode, this.eventParam)
    .pipe(takeUntil(this.unsubscribeAll$)).subscribe(async (result: any) => {
      await this.loading.dismiss();
      if (result?.Documents === null) {
        this.tranService.errorToastMessage('no_documents');
      } else {
        this.documents = result.Documents;
        this.totalCount = result.Count;
      }
    }, async (error: any) => {

      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getDocuments();
  }



  cellClick(event) {
  }

  async performDelete(document) {
    let documentId = document.Id;
    await this.loading.present();
    this.documentService.deleteDocument(documentId).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.getDocuments();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async getDocument(document): Promise<void> {
    await this.loading.present();
    this.documentService.getDocument(document.Id).subscribe(async (result: DocumentDetail) => {
      await this.loading.dismiss();
      !!result?.Content
        ? this.datatableService.saveDocument(result.Content, result.Name, result.FileType)
        : this.tranService.errorToastMessage('NoDocuments');
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }
}