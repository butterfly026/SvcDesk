import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ChangeDetectorRef, } from '@angular/core';
import { LoadingService, TranService, GridService, FileService } from 'src/services';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { GlobalService } from 'src/services/global-service.service';
import { AlertController } from '@ionic/angular';
import { AlertService } from 'src/services/alert-service.service';
import { Paging } from 'src/app/model';
import { Subject } from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ServiceDocumentService } from './service-document-child/services/service-document.service';
import { ServiceDocumentChildComponent } from './service-document-child/service-document-child.component';
import { DatatableAction, DocumentDetail, MessageForRowDeletion, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { takeUntil } from 'rxjs/operators';
import { DialogComponent } from 'src/app/Shared/components';
import { DatatableService } from 'src/app/Shared/services';

@Component({
  selector: 'app-service-document',
  templateUrl: './service-document.component.html',
  styleUrls: ['./service-document.component.scss'],
})
export class ServiceDocumentComponent implements OnInit {
  @Input() ServiceReference: string = '';
  @Input() ServiceID: string = '';

  @Input() Refresh: Boolean = true;
  @Output('ServiceDocument') ServiceDocument: EventEmitter<string> = new EventEmitter<string>();

  newDocumentConfig = new MatDialogConfig();
  newDocumentDialog: MatDialogRef<ServiceDocumentChildComponent, any> | undefined;

  PrefixExcelFileName: string = 'ServiceDocument';

  pageTitle: string = '';

  showClose: boolean = true;
  showForm: boolean = true;
  totalLength: any;

  documents: any[] = [];
  docState: string = 'view';

  totalCount: number = 0;
  columns: string[] = [];
  columnIDs: string[] = [];
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
    private globService: GlobalService,
    private documentService: ServiceDocumentService,
    private loading: LoadingService,
    private tranService: TranService,
    private gridService: GridService,
    private fileService: FileService,
    private alertCtrl: AlertController,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
    private datatableService: DatatableService,
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
    this.csvFileName = 'Service Documents - ' + this.ServiceID;
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
    this.ServiceDocument.emit('close');
  }
  async getCreateDocPermission() {

    const dialogRef = this.matDialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '500px',
      panelClass: 'dialog',
      data: {
        component: ServiceDocumentChildComponent,
        ServiceReference: this.ServiceReference,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'created') {
        this.getDocuments();
      }
    });
  }
  switchCreateDoc() {
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
    this.permissions = value.map(s => s.Resource.replace('/Services/Documents', "").replace('/', "") as PermissionType);
  }
  async getPermission() {
    await this.loading.present();
    this.globService.getAuthorization('/Services/Documents', true)
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
    this.documentService.getAllDocuments(this.ServiceReference, this.eventParam).subscribe(async (result: any) => {
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
    const args = event.args;
    let selectedRowIndex = args.rowindex;
    let columIndex = args.columnindex;
    // let value = this.FileListGrid.getrowdata(selectedRowIndex);
    // if (columIndex === 7) {
    //   this.getDocument(value.id);
    // } else if (columIndex === 8) {
    //   this.deleteDocument(value.id);
    // }
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
