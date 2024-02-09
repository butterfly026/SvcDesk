import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AccountTasksListService } from '../services/task-list.service';
import { AccountTaskItem, CategoryItem, CategoryTypeItem, DialogDataItem, NextNumber, Priority, Requestor, Resolution, Status, TaskDocument, TaskGroup } from '../account-task-list.types';
import { AlertService } from 'src/services/alert-service.service';
import { SpinnerService } from 'src/app/Shared/services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { AccountTaskDocumentListComponent } from '../account-task-document-list/account-task-document-list.component';
declare var CKEDITOR;

@Component({
  selector: 'app-account-task-new',
  templateUrl: './account-task-new.component.html',
  styleUrls: ['./account-task-new.component.scss'],
  providers: [DatePipe]
})
export class AccountTaskNewComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() EditMode: string = 'New';
  @Input() CategoryId: string = '';
  @Output('AccountTaskNewComponent') AccountTaskNewComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  @ViewChild(AccountTaskDocumentListComponent) docListComponent;
  
  taskForm: UntypedFormGroup;
  templateContent: string = '';

  categoryList: CategoryItem[] = [];
  taskList: CategoryTypeItem[] = [];
  statusList: Status[] = [];
  requesterList: Requestor[] = [];
  priorityList: Priority[] = [];
  resolutionList: Resolution[] = [];
  groupList: TaskGroup[] = [];

  nextNumber: NextNumber = {
    Number: '',
  };

  private isModalDlg: boolean = false;
  private taskId: number;
  

  createdDate: any;

  constructor(
    private tranService: TranService,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
    private taskService: AccountTasksListService,
    private spinnerService: SpinnerService,
    public globService: GlobalService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<AccountTaskNewComponent>,    
    @Inject(MAT_DIALOG_DATA) private dlgData: DialogDataItem
  ) {
    this.taskForm = this.formBuilder.group({
      Category: ['', Validators.required],
      Task: ['', Validators.required],
      Status: ['', Validators.required],
      Requester: ['', Validators.required],
      Priority: ['', Validators.required],
      Number: ['', Validators.required],
      Group: ['', Validators.required],
      CustomerRef: [''],
      EmailAddress: ['', [Validators.email]],
      DisplayCustomer: [false],
      CreatedDate: ['', Validators.required],
      ComplatedDateState: [null],
      CompletedDate: [''],
      Resolution: [''],
      Followup: [''],
      FollowupState: [null],
      SLA: [''],
      SLAState: [null],
      ShortDescription: ['',],
      Details: ['',],
    });

    let d = new Date();
    this.createdDate = this.datePipe.transform(d, 'yyyy-MM-dd');
    this.taskForm.get('CompletedDate').enable();
    this.taskForm.get('CompletedDate').updateValueAndValidity();

    // this.taskForm.get('FollowupState').valueChanges.subscribe(result => {
    //   if (result) {
    //     this.taskForm.get('Followup').enable();
    //     this.taskForm.get('Followup').setValidators([Validators.required]);
    //     this.taskForm.get('Followup').updateValueAndValidity();
    //   } else {
    //     this.taskForm.get('Followup').disable();
    //     this.taskForm.get('Followup').setValidators(null);
    //     this.taskForm.get('Followup').updateValueAndValidity();
    //   }
    // });

    // this.taskForm.get('SLAState').valueChanges.subscribe(result => {
    //   if (result) {
    //     this.taskForm.get('SLA').enable();
    //     this.taskForm.get('SLA').setValidators([Validators.required]);
    //     this.taskForm.get('SLA').updateValueAndValidity();
    //   } else {
    //     this.taskForm.get('SLA').disable();
    //     this.taskForm.get('SLA').setValidators(null);
    //     this.taskForm.get('SLA').updateValueAndValidity();
    //   }
    // });

    
    this.taskForm.get('Category').valueChanges.subscribe(result => {
      if (result) {
        this.getTypesFromCategories(result);
      } 
    });

    this.taskForm.get('ComplatedDateState').setValue(false);
    // this.taskForm.get('FollowupState').setValue(false);
    // this.taskForm.get('SLAState').setValue(false);
  }

  ngOnInit() {
    if(this.dlgData?.ContactCode){
      this.ContactCode = this.dlgData.ContactCode;
    }
    if(this.dlgData?.IsModal){
      this.isModalDlg = this.dlgData.IsModal;
    }
    if(this.dlgData?.EditMode){
      this.EditMode = this.dlgData.EditMode;
    }
    if(this.dlgData?.TaskId){
      this.taskId = this.dlgData.TaskId;
    }
    this.getPermission();
    if(this.CategoryId){
      this.taskForm.removeControl('Category');
    }
   }

  get f() {
    return this.taskForm.controls;
  }

  async submitForm(): Promise<void> {
    if (this.taskForm.valid) {
      let task: AccountTaskItem = {
        VisibleToCustomer: this.taskForm.get('DisplayCustomer').value,
        
        TypeId: this.taskForm.get('Task').value,
        Reference: this.taskForm.get('CustomerRef').value,
        Number: this.taskForm.get('Number').value,
        RequestedBy: this.taskForm.get('Requester').value,
        StatusId: this.taskForm.get('Status').value,
        ResolutionId: this.taskForm.get('Resolution').value,
        GroupId: this.taskForm.get('Group').value,
        PriorityId: this.taskForm.get('Priority').value,
        ShortDescription: this.taskForm.get('ShortDescription').value,
        Description: this.templateContent,
        Emails: [
          {
            Id: null,
            Address: this.taskForm.get('EmailAddress').value,
          }
        ]
      };
      if(this.taskForm.get('Followup').value){
        task.NextFollowupDate = this.taskForm.get('Followup').value;
      }
      if(this.taskForm.get('SLA').value){
        task.SLAData = this.taskForm.get('SLA').value;
      }
      if(this.taskForm.get('CompletedDate').value){
        task.CompletedDate = this.taskForm.get('CompletedDate').value;
      }
      await this.spinnerService.loading();
      if(this.EditMode == 'New'){
        this.taskService.createTask(this.ContactCode, task)
        .subscribe({
          next: async (result) => {
            await this.spinnerService.end();
            if(this.docListComponent.getNewDocuments()?.length > 0){
              this.docListComponent.getNewDocuments().forEach(doc => {
                this.createDocument(result.Id, doc);
              });
            }        
          },
          error: async (error: any) => {
            await this.spinnerService.end();
            this.tranService.errorMessage(error);
          }
        });
      } else if(this.EditMode == 'Update'){
        this.taskService.updateTask(this.taskId.toString(), task)
        .subscribe({
          next: async (result) => {
            await this.spinnerService.end();
            if(this.docListComponent.getNewDocuments()?.length > 0){
              this.docListComponent.getNewDocuments().forEach(doc => {
                this.createDocument(result.Id, doc);
              });
            }        
          },
          error: async (error: any) => {
            await this.spinnerService.end();
            this.tranService.errorMessage(error);
          }
        });
      }
      
    }
  }

  async createDocument(taskId: string, doc: TaskDocument): Promise<void>{    
    await this.spinnerService.loading();
    this.taskService.createDocument(taskId, doc)
      .subscribe({
        next: async (result) => {
          await this.spinnerService.end();
        },
        error: async (error: any) => {
          await this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }
  
  async getPermission(){
    await this.spinnerService.loading();
    this.globService.getAuthorization('/Accounts/Tasks/New', true).subscribe(async (_result) => {
      await this.spinnerService.end();    
      if(!this.CategoryId) this.getCategories();
      this.getStatuses();
      this.getRequestors();
      this.getStatuses();
      this.getPriorities();
      this.getNextNumber();
      this.getResolutions();       
      this.getTaskGroups(); 
      if(this.CategoryId){
        this.getTypesFromCategories(this.CategoryId);
      }
      if(this.EditMode == 'Detail' && this.taskId){
        this.getTaskDetailInfo();
      }
    }, async (err) => {
      await this.spinnerService.end();
      const errResult = this.globService.ConvertKeysToLowerCase(err);
      this.tranService.errorMessage('resource_forbidden');
      console.log('errResult', errResult);
      if(this.isModalDlg){
        this.dialogRef.close();
      }else{
        if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
          this.alertService.closeAllAlerts();        
          setTimeout(() => {
            this.goBack();
          }, 1000);
        } else {
          
        }
      }
    });
  }
  private async getCategories(){
    await this.spinnerService.loading();
    this.taskService.getTaskCategories()
      .subscribe({
        next: async (result) => {
          await this.spinnerService.end();
          this.categoryList = result;
          if(this.categoryList?.length == 1){
            this.CategoryId = this.categoryList[1].Id.toString();
            if(this.CategoryId){
              this.getTypesFromCategories(this.CategoryId);
            }
          }
        },
        error: async (error: any) => {
          await this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getTypesFromCategories(taskId: string){
    await this.spinnerService.loading();
    this.taskService.getTypesFromCategories(taskId)
      .subscribe({
        next: async (result) => {
          await this.spinnerService.end();
          this.taskList = result;
        },
        error: async (error: any) => {
          await this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getStatuses(){
    await this.spinnerService.loading();
    this.taskService.getStatuses()
      .subscribe({
        next: async (result) => {
          await this.spinnerService.end();
          this.statusList = result;
        },
        error: async (error: any) => {
          await this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getRequestors(){
    await this.spinnerService.loading();
    this.taskService.getRequestors(this.ContactCode)
      .subscribe({
        next: async (result) => {
          await this.spinnerService.end();
          this.requesterList = result;
        },
        error: async (error: any) => {
          await this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getResolutions(){
    await this.spinnerService.loading();
    this.taskService.getResolutions()
      .subscribe({
        next: async (result) => {
          await this.spinnerService.end();
          this.resolutionList = result;
        },
        error: async (error: any) => {
          await this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getPriorities(){
    await this.spinnerService.loading();
    this.taskService.getPriorities()
      .subscribe({
        next: async (result) => {
          await this.spinnerService.end();
          this.priorityList = result;
        },
        error: async (error: any) => {
          await this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getNextNumber(){
    await this.spinnerService.loading();
    this.taskService.getNextNumber()
      .subscribe({
        next: async (result) => {
          await this.spinnerService.end();
          this.nextNumber = result;
          this.taskForm.get('Number').setValue(result.Number);
        },
        error: async (error: any) => {
          await this.spinnerService.end();
          this.tranService.errorMessage(error);
          this.taskForm.get('Number').setValue('');
        }
      });
  }

  private async getTaskGroups(): Promise<void>{
    await this.spinnerService.loading();
    this.taskService.getTaskGroups()
      .subscribe({
        next: async (result: TaskGroup[]) => {
          await this.spinnerService.end();
          if(result && result.length > 0){
            result.sort((a, b) => (a.DisplayOrder - b.DisplayOrder));
            result.filter(option => option.Active);
            this.groupList = result;
          }
        },
        error: async (error: any) => {
          await this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  private async getTaskDetailInfo(): Promise<void>{
    await this.spinnerService.loading();
    this.taskService.getTaskDetail(this.taskId.toString())
      .subscribe({
        next: async (result: TaskGroup[]) => {
          await this.spinnerService.end();
          
        },
        error: async (error: any) => {
          await this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

  submitTrigger() {
    document.getElementById('ticketFormSubmitButton').click();
  }

  change() {
    const editResult = CKEDITOR.currentInstance.getData();
    this.taskForm.get('Details').setValue(editResult);
  }

  goBack() {
    if(this.isModalDlg){
      this.dialogRef.close();
    }else{
      this.AccountTaskNewComponent.emit({ type: 'close' });
    }

  }

  focusOutReporter(): void{
    let isValid = false;
    for (let list of this.requesterList) {
      if (list.Name === this.taskForm.get('Requester').value) {
        isValid = true;
        break;
      }
    }
    if(!isValid){
      this.taskForm.get('Requester').setValue('');
    }
  }

}
