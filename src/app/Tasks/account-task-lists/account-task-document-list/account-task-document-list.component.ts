import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DatatableAction, MessageForRowDeletion, PermissionType, SearchOption } from 'src/app/Shared/models';
import { SpinnerService } from 'src/app/Shared/services';
import { Paging } from 'src/app/model';
import { TranService } from 'src/services';
import { AccountTasksListService } from '../services/task-list.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/Shared/components';
import { AccountTaskDocumentNewComponent } from '../account-task-document-new/account-task-document-new.component';
import { TaskDocument } from '../account-task-list.types';

@Component({
  selector: 'app-account-task-document-list',
  templateUrl: './account-task-document-list.component.html',
  styleUrls: ['./account-task-document-list.component.scss']
})
export class AccountTaskDocumentListComponent implements OnInit {
  @Input() Refresh: Boolean = true;
  @Input() TaskId: string;
  documents: any[] = [];
  docState: string = 'view';

  totalCount: number = 0;
  columns: string[] = [];
  dataTableAction: DatatableAction = { row: ['Download', 'Delete'], toolBar: ['Create'] };
  searchOptions: SearchOption[] = [];
  _showSearchOption: boolean = false;
  permissions: PermissionType[] = ['New', 'Download', 'Delete'];
  csvFileName: string = '';

  eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private Refresh_: Boolean = true;

  deletionMsg: MessageForRowDeletion = {
    header: this.tranService.instant('are_you_sure'),
    message: this.tranService.instant('are_you_sure_delete_document'),
  }
  constructor(
    private tranService: TranService,
    private spinnerService: SpinnerService,
    private documentService: AccountTasksListService,
    private dialog: MatDialog,
  ) {
    this.configInitialValues();
  }

  ngOnInit() {
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

  private configInitialValues(): void {
    this.columns = [
      'Name',
      'FileType',
      'Note',
      'Author',
      'DateAuthored',
      'UserEditable',
      'ContactEditable',
      'ContactVisible',
    ];
  }

  async getDocuments() {
    if(!this.TaskId) return;
    await this.spinnerService.loading();
    this.documents = [];
    this.documentService.getAllDocuments(this.TaskId)
      .pipe(takeUntil(this.unsubscribeAll$)).subscribe(async (result: any) => {
        await this.spinnerService.end();
        if (result?.Documents === null) {
          this.tranService.errorToastMessage('no_documents');
        } else {
          this.documents = result.Documents;
          this.totalCount = result.Count;
        }
      }, async (error: any) => {

        await this.spinnerService.end();
        this.tranService.errorMessage(error);
      });
  }

  newDoc(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '300px',
      panelClass: 'dialog',
      data: {
        component: AccountTaskDocumentNewComponent,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (typeof res == 'object' && res.result == 'success') {
        let tmpDocs: TaskDocument[] = [...this.documents];
        tmpDocs.push(res.data);
        this.documents = tmpDocs;
        this.totalCount = tmpDocs.length;
      }
    });
  }

  downloadDocument(doc): void {

  }

  onDelete(doc): void {
    const idx = this.documents.indexOf(doc);
    if(idx != -1){
      let tmpDocs: TaskDocument[] = [...this.documents];
      tmpDocs.splice(idx);
      this.documents = tmpDocs;
    }
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getDocuments();
  }
  
  public getNewDocuments(): TaskDocument[] {
    return this.documents;
  }
}
