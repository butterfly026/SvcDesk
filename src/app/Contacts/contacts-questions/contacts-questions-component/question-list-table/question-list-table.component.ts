import { Component, Input, OnInit } from '@angular/core';
import { DatatableAction, MessageForRowDeletion, PermissionType, SearchOption } from 'src/app/Shared/models';
import { QuestionItem } from '../../contacts-questions.page.types';
import { Paging } from 'src/app/model';
import { Subject } from 'rxjs';
import { LoadingService, TranService } from 'src/services';
import { IdentificationService, QuestionService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { QuestionNewComponent } from '../question-new/question-new.component';
import { DialogComponent } from 'src/app/Shared/components';

@Component({
  selector: 'app-question-list-table',
  templateUrl: './question-list-table.component.html',
  styleUrls: ['./question-list-table.component.scss'],
})
export class QuestionListTableComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() Refresh: Boolean = true;
  @Input() permissions: PermissionType[] = [];

  dataSource: QuestionItem[] = [];
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
    private questionService: QuestionService,
    private dialog: MatDialog,
    private alertService: AlertService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.configInitialValues();
    this.tranService.convertText('are_you_sure').subscribe(value => {
      this.deletionMsg.header = value;
    });
    this.tranService.convertText('delete_confirm_question').subscribe(value => {
      this.deletionMsg.message = value;
    });
  }
  private configInitialValues(): void {
    this.columns = [
      'Question',
      'Answer'
    ];
  }
  ngOnInit() { 
    this.csvFileName = 'Security Questions - ' + this.ContactCode;
    this.getQuestions();
  }

  ngOnChanges(): void {
    if (this.Refresh !== undefined && this.Refresh !== this.Refresh_) {
      this.getQuestions()
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
    this.getQuestions();
  }

  async getQuestions(){
    this.dataSource = [];    
    await this.loading.present();
    this.dataSource = [];
    this.questionService.getQuestionsListWithContactCode(this.ContactCode).subscribe(async (result: any) => {
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

  async deleteQuestion(selectedData: QuestionItem){
    await this.loading.present();
    this.questionService.deleteQuestion(selectedData.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.getQuestions();
    }, async (error: any) => {      
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  updateQuestion(selectedData: QuestionItem){
    
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '450px',
      maxHeight: '350px',
      panelClass: 'dialog',
      data: {
        component: QuestionNewComponent,
        ContactCode: this.ContactCode,
        Permissions: this.permissions,
        EditMode: 'Update',
        Data: selectedData,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res === 'ok') {
        this.getQuestions();
      }
    });

  }

  newQuestion(){
    
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '450px',
      maxHeight: '350px',
      panelClass: 'dialog',
      data: {
        component: QuestionNewComponent,
        ContactCode: this.ContactCode,
        Permissions: this.permissions,
        EditMode: 'New',
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res === 'ok') {
        this.getQuestions();
      }
    });
  }

}
