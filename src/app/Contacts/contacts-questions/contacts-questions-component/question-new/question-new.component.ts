import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { TranService, LoadingService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { QuestionService } from '../../services';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { PermissionType } from 'src/app/Shared/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogDataItem, QuestionItem } from '../../contacts-questions.page.types';
import { SpinnerService } from 'src/app/Shared/services';
import { MatAlertService } from 'src/app/Shared/services/mat-alert.service';

@Component({
  selector: 'app-question-new',
  templateUrl: './question-new.component.html',
  styleUrls: ['./question-new.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class QuestionNewComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() permissions: PermissionType[] = [];
  @Input() EditMode: string = 'New';
  @Output('QuestionsComponent') QuestionsComponent: EventEmitter<string> = new EventEmitter<string>();

  

  questionForm: UntypedFormGroup;
  availQuestions: any[] = [];
  questionsList: any[] = [];
  customerQuestions: any[] = [];
  idList: any[] = [];

  availAdd: boolean = false;
  getquestion: boolean = false;
  getUserQuestion: boolean = false;

  areSure: string = '';
  warning: string = '';

  addNewQuestion: boolean = false;
  selectedQuestion: QuestionItem = null;

  constructor(
    private tranService: TranService,
    public globService: GlobalService,
    private matAlert: MatAlertService,
    private formBuilder: UntypedFormBuilder,
    private questionService: QuestionService,
    private spinnerService: SpinnerService,
    private alertCtrl: AlertController,
    private dialogRef: MatDialogRef<QuestionNewComponent>,    
    @Inject(MAT_DIALOG_DATA) private dlgData: DialogDataItem
  ) {
    this.questionForm = this.formBuilder.group({
      newquestion: ['', Validators.required],
      newanswer: ['', Validators.required],
    });
    this.tranService.translaterService();
    

    this.tranService.convertText('are_you_sure').subscribe(value => {
      this.areSure = value;
    });
    this.tranService.convertText('your_change_lost').subscribe(value => {
      this.warning = value;
    });
  }

  ngOnInit() {
    if(this.dlgData?.ContactCode){
      this.ContactCode = this.dlgData.ContactCode;
    }
    if(this.dlgData?.Permissions){
      this.permissions = this.dlgData.Permissions;
    }
    if(this.dlgData?.EditMode){
      this.EditMode = this.dlgData.EditMode;
    }
    if(this.dlgData?.Data){
      this.selectedQuestion = this.dlgData.Data;
    }
    this.getQuestionList();
  }

  get f() {
    return this.questionForm.controls;
  }

  async getQuestionList() {
    await this.spinnerService.loading();
    this.questionService.getQuestionsList().subscribe(async (result: any) => {
      
      await this.spinnerService.end();
      this.questionsList = this.globService.ConvertKeysToLowerCase(result);
      this.getquestion = true;
      if (this.getUserQuestion) {
        this.checkAvailableQuestions();
      }
      this.getCustomerQuestions();
    }, async (error: any) => {
      
      await this.spinnerService.end();
      const errResult = this.globService.ConvertKeysToLowerCase(error);
      this.tranService.matErrorMessage(errResult, (title, button, content) => {
        this.matAlert.alert(content, title, button);
      });
    });
  }

  async getCustomerQuestions() {
    this.customerQuestions = [];
    await this.spinnerService.loading();
    this.questionService.getQuestionsListWithContactCode(this.ContactCode).subscribe(async (result: any) => {
      
      await this.spinnerService.end();
      let _result = this.globService.ConvertKeysToLowerCase(result);
      if(this.EditMode == 'Update' && this.selectedQuestion){
        this.customerQuestions = _result.filter(item => item.questionid != this.selectedQuestion.QuestionId);
      }else{
        this.customerQuestions = _result;
      }
      this.getUserQuestion = true;
      if (this.getquestion) {
        this.checkAvailableQuestions();
      }
      if(this.selectedQuestion && this.EditMode == 'Update'){
        this.questionForm.get('newquestion').setValue(this.selectedQuestion.QuestionId);
        this.questionForm.get('newanswer').setValue(this.selectedQuestion.Answer);
      }
    }, async (error: any) => {
      
      await this.spinnerService.end();
      const errResult = this.globService.ConvertKeysToLowerCase(error);
      this.tranService.matErrorMessage(errResult, (title, button, content) => {
        this.matAlert.alert(content, title, button);
      });
    });
  }

  async saveQuestion(){
    if(this.EditMode == 'Update' && this.selectedQuestion){
      this.updateQuestion();
    }else{
      this.createQuestion();
    }
  }

  async createQuestion() {
    const reqParam = {
      'Id': this.questionForm.get('newquestion').value,
      'Answer': this.questionForm.get('newanswer').value
    };

    await this.spinnerService.loading();
    this.questionService.createQuestion(this.globService.convertRequestBody(reqParam), this.ContactCode).subscribe(async (result: any) => {
      await this.spinnerService.end();      
      this.dialogRef.close('ok');
    }, async (error: any) => {
      
      await this.spinnerService.end();
      const errResult = this.globService.ConvertKeysToLowerCase(error);
      this.tranService.matErrorMessage(errResult, (title, button, content) => {
        this.matAlert.alert(content, title, button);
      });
    });
  }

  async updateQuestion() {
      const reqParam = {
        'Answer': this.questionForm.get('newanswer').value,
      };

      await this.spinnerService.loading();
      this.questionService.updateQuestion(this.selectedQuestion.Id, this.globService.convertRequestBody(reqParam)).subscribe(async (result: any) => {
        await this.spinnerService.end();
        this.dialogRef.close('ok');
      }, async (error: any) => {
        
        await this.spinnerService.end();
        const errResult = this.globService.ConvertKeysToLowerCase(error);
        this.tranService.matErrorMessage(errResult, (title, button, content) => {
          this.matAlert.alert(content, title, button);
        });
      });
  }

  async deleteQuestion(index, questionId) {

    await this.spinnerService.loading();
    this.questionService.deleteQuestion(questionId).subscribe(async (result: any) => {
      
      await this.spinnerService.end();
      this.customerQuestions.splice(index, 1);
      this.checkAvailableQuestions();
    }, async (error: any) => {
      
      await this.spinnerService.end();
      const errResult = this.globService.ConvertKeysToLowerCase(error);
      this.tranService.matErrorMessage(errResult, (title, button, content) => {
        this.matAlert.alert(content, title, button);
      });
    });
  }

  switchEdit(index) {
    this.customerQuestions[index].mode = !this.customerQuestions[index].mode;
    if (this.customerQuestions[index].mode) {
      this.questionForm.get('question' + this.customerQuestions[index].questionid).enable();
    } else {
      this.questionForm.get('question' + this.customerQuestions[index].questionid).setValue(this.customerQuestions[index].answer);
      this.questionForm.get('question' + this.customerQuestions[index].questionid).disable();
    }
  }

  checkAvailableQuestions() {
    this.availQuestions = [];
    for (let list of this.questionsList) {
      let available = false;
      for (let userQuestion of this.customerQuestions) {
        if (list.id === userQuestion.questionid) {
          available = true;
        }
      }
      if (!available) {
        this.availQuestions.push(list);
      }
    }
  }

  addQuestion() {
    if (this.questionForm.contains('newquestion')) {

    } else {
      this.addNewQuestion = true;
      this.questionForm.addControl('newquestion', new UntypedFormControl('', Validators.required));
      this.questionForm.addControl('newanswer', new UntypedFormControl('', Validators.required));
      this.questionForm.get('newanswer').disable();
    }
  }

  removeNewQuestion() {
    this.addNewQuestion = false;
    this.questionForm.removeControl('newquestion');
    this.questionForm.removeControl('newanswer');
  }

  async presentAlert(index, serverId) {
    const alert = await this.alertCtrl.create({
      message: this.areSure,
      subHeader: this.warning,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteQuestion(index, serverId);
          }
        }
      ]
    });
    await alert.present();
  }

  selectQuestion() {
    this.questionForm.get('newanswer').enable();
  }

  close(){
    this.dialogRef.close();
  }
}
