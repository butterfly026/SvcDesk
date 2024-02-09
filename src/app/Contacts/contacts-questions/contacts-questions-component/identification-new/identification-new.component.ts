import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { TranService, LoadingService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { IdentificationService } from '../../services';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { PermissionType } from 'src/app/Shared/models';
import * as moment from 'moment';
import { SpinnerService } from 'src/app/Shared/services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogDataItem, IdentificationItem } from '../../contacts-questions.page.types';

@Component({
  selector: 'app-identification-new',
  templateUrl: './identification-new.component.html',
  styleUrls: ['./identification-new.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class IdentificationNewComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() permissions: PermissionType[] = [];
  @Input() EditMode: string = 'New';
  @Output('IdentificationComponent') IdentificationComponent: EventEmitter<string> = new EventEmitter<string>();

  

  idForm: UntypedFormGroup;
  availIdList: any[] = [];
  idTypeList: any[] = [];
  customerIdList: any[] = [];

  availAdd: boolean = false;
  getIdType: boolean = false;
  getCustomerId: boolean = false;

  areSure: string = '';
  warning: string = '';

  addNewIdentification: boolean = false;
  newSelectIdType: any;
  issueDate: any;
  createIssueDate: any;
  selectedIdentification: IdentificationItem = null;

  constructor(
    private tranService: TranService,
    public globService: GlobalService,
    
    private formBuilder: UntypedFormBuilder,
    private idService: IdentificationService,
    private spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef,
    private alertCtrl: AlertController,
    private dialogRef: MatDialogRef<IdentificationNewComponent>,    
    @Inject(MAT_DIALOG_DATA) private dlgData: DialogDataItem
  ) {
    this.idForm = this.formBuilder.group({
      newIdentification: ['', Validators.required],
      newIdValue: ['', Validators.required],
    });
    this.tranService.translaterService();
    

    this.tranService.convertText('are_you_sure').subscribe(value => {
      this.areSure = value;
    });
    this.tranService.convertText('your_change_lost').subscribe(value => {
      this.warning = value;
    });
    this.createIssueDate = new Date('1990-01-01');
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
      this.selectedIdentification = this.dlgData.Data;
    }
    this.getIdTypes();
  }

  get f() {
    return this.idForm.controls;
  }

  async getIdTypes() {
    await this.spinnerService.loading();
    this.idService.getIdentificationTypes().subscribe(async (result: any) => {
      
      await this.spinnerService.end();
      this.idTypeList = this.globService.ConvertKeysToLowerCase(result);
      this.getIdType = true;
      if (this.getCustomerId) {
        this.checkAvailableIdentifications();
      }
      this.getCustomerIdintifications();
    }, async (error: any) => {
      
      await this.spinnerService.end();
      this.tranService.errorMessage(error);
    });
  }

  async getCustomerIdintifications() {
    this.customerIdList = [];
    await this.spinnerService.loading();
    this.idService.getCustomerIdList(this.ContactCode).subscribe(async (result: any) => {
      
      await this.spinnerService.end();
      let _result = this.globService.ConvertKeysToLowerCase(result);
      if(this.EditMode == 'Update' && this.selectIdentification){
        this.customerIdList = _result.filter(item => item.typeid != this.selectedIdentification.TypeId);
      }else{
        this.customerIdList = _result;
      }
      this.getCustomerId = true;
      if (this.getIdType) {
        this.checkAvailableIdentifications();
      }
      if(this.EditMode == 'Update' && this.selectedIdentification){
        this.idForm.get('newIdentification').setValue(this.selectedIdentification.TypeId);
        this.idForm.get('newIdValue').setValue(this.selectedIdentification.Value);        
        if(this.selectedIdentification.HasExpiryDate){
          this.idForm.addControl('newExpireDate', new UntypedFormControl(this.globService.getCurrentDateFormat(this.selectedIdentification.ExpiryDate), Validators.required));
          this.idForm.get('newExpireDate').setValue(this.selectedIdentification.ExpiryDate);
        }
        if (this.selectedIdentification.HasIssueDate) {
          this.idForm.addControl('newIssueDate', new UntypedFormControl(this.globService.getCurrentDateFormat(this.selectedIdentification.IssueDate), Validators.required));
          this.idForm.get('newIssueDate').setValue(this.selectedIdentification.IssueDate);
        }
        this.availIdList.forEach((idData) => {
          if(idData.id == this.selectedIdentification.TypeId){
            this.newSelectIdType = idData;
          }
        });
        this.cdr.detectChanges();
      }
    }, async (error: any) => {
      
      await this.spinnerService.end();
      this.tranService.errorMessage(error);
    });
  }

  async createIdentification(reqParam: IdentificationItem) {
    if (this.idForm.valid) {
      await this.spinnerService.loading();
      this.idService.createIdentification(this.globService.convertRequestBody(reqParam), this.ContactCode).subscribe(async (result: any) => {
        
        await this.spinnerService.end();
        this.dialogRef.close('ok');
      }, async (error: any) => {
        
        await this.spinnerService.end();
        this.tranService.errorMessage(error);
      });
    }
  }

  async saveIdentification(){
    let reqParam: IdentificationItem = {
      TypeId: this.idForm.get('newIdentification').value,
      Name: this.newSelectIdType.name,
      Value: this.idForm.get('newIdValue').value,
      ExpiryDate: '',
      IssueDate: '',
      HasExpiryDate: this.newSelectIdType.hasexpirydate,
      IsCreditCard: this.newSelectIdType.iscreditcard,
      HasIssueDate: this.newSelectIdType.hasissuedate,
      AllowDuplicates: this.newSelectIdType.allowduplicates,
    };

    if (this.newSelectIdType.hasexpirydate) {
      reqParam.ExpiryDate = moment(this.idForm.get('newExpireDate').value).format('YYYY-MM-DD');
    }
    if (this.newSelectIdType.hasissuedate) {
      reqParam.IssueDate = moment(this.idForm.get('newIssueDate').value).format('YYYY-MM-DD');
    }
    if(this.EditMode == 'New'){
      this.createIdentification(reqParam);
    }else if(this.EditMode == 'Update'){
      this.updateIdentification(reqParam, this.selectedIdentification.Id);
    }
  }

  async updateIdentification(reqParam: IdentificationItem, identification: string) {
    if (this.idForm.valid) {
      await this.spinnerService.loading();
      this.idService.updateIdentification(identification, reqParam).subscribe(async (result: any) => {
        
        await this.spinnerService.end();
        this.dialogRef.close('ok');
      }, async (error: any) => {
        
        await this.spinnerService.end();
        this.tranService.errorMessage(error);
      });
    }
  }

  checkAvailableIdentifications() {
    this.availIdList = [];
    for (let list of this.idTypeList) {
      let available = false;
      for (let userQuestion of this.customerIdList) {
        if (list.id === userQuestion.typeid && !list.allowduplicates) {
          available = true;
        }
      }
      if (!available) {
        this.availIdList.push(list);
      }
    }
  }

  selectIdentification(index) {
    this.createIssueDate = new Date('1990-01-01');
    if(this.availIdList[index] != this.newSelectIdType){
      this.idForm.get('newIdValue')?.setValue('');
      this.idForm.get('newExpireDate')?.setValue('');
      this.idForm.get('newIssueDate')?.setValue('');
    }
    this.newSelectIdType = this.availIdList[index];
    if (this.newSelectIdType.hasexpirydate) {
      this.idForm.addControl('newExpireDate', new UntypedFormControl('', Validators.required));
    }

    if (this.newSelectIdType.hasissuedate) {
      this.idForm.addControl('newIssueDate', new UntypedFormControl('', Validators.required));
    }
  }

  changedIssueDate(id, event) {
    this.issueDate = this.idForm.get('newIssueDate').value;
    if(this.newSelectIdType.hasissuedate){
      this.idForm.get('newIssueDate').markAsTouched();
    }
    
  }

  changeCrateIssueDate() {
    this.createIssueDate = this.idForm.get('newExpireDate').value;
    if (this.newSelectIdType.hasexpirydate) {
      this.idForm.get('newExpireDate').markAsTouched();
    }
  }

  close(){
    this.dialogRef.close();
  }
}
