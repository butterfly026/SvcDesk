import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ContactFormItem, ContactTitles, DialogDataItem, RelatedContact, RelatedContactDetail, RelationshipType } from '../related-contacts.types';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TranService } from 'src/services';
import { AlertController } from '@ionic/angular';
import { RelatedContactsService } from '../services/related-contacts.service';
import { GlobalService } from 'src/services/global-service.service';
import { SpinnerService } from 'src/app/Shared/services';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAlertService } from 'src/app/Shared/services/mat-alert.service';
import { ContactsAuthService } from 'src/app/Authentication/contact-authentication/services/contacts-authentication.service';

@Component({
  selector: 'app-related-contacts-new',
  templateUrl: './related-contacts-new.component.html',
  styleUrls: ['./related-contacts-new.component.scss']
})
export class RelatedContactsNewComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() EditMode: string = 'New';
  @Input() UpdateContactId: string = '';
  @Input() RelatedContact: RelatedContact = null;
  @Output('RelatedContactsNewComponent') RelatedContactsNewComponent: EventEmitter<any> = new EventEmitter<any>();  

  groupList: ContactFormItem[] = [];

  contactForm: UntypedFormGroup;

  typeList: RelationshipType[] = [];

  titleList: ContactTitles[] = [];

  arrayLength: number = 0;

  areSure: string = '';
  warning: string = '';
  updateData: RelatedContactDetail = null;
  selectedRelationships: string[] = [];
  spinner: any = {};

  constructor(    
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    private authService: ContactsAuthService,
    private alertCtrl: AlertController,
    private relateService: RelatedContactsService,
    private matAlert: MatAlertService,
    private spinnerService: SpinnerService,
    public globService: GlobalService,
    private dialogRef: MatDialogRef<RelatedContactsNewComponent>,    
    @Inject(MAT_DIALOG_DATA) private dlgData: DialogDataItem
  ) {


    this.tranService.convertText('are_you_sure').subscribe(value => {
      this.areSure = value;
    });
    this.tranService.convertText('your_change_lost').subscribe(value => {
      this.warning = value;
    });
    this.contactForm = this.formBuilder.group({
      TypeCtrl: ['', Validators.required],
      TitleCtrl: ['', Validators.required],
      Email: ['', Validators.email],
      Mobile: [''],
      FirstNameCtrl: ['', Validators.required],
      FamilyNameCtrl: ['', Validators.required],
    });

  }

  ngOnInit() {
    
    if(this.dlgData?.ContactCode){
      this.ContactCode = this.dlgData.ContactCode;
    }
    if(this.dlgData?.EditMode){
      this.EditMode = this.dlgData.EditMode;
    }
    if(this.dlgData?.Data){
      this.RelatedContact = this.dlgData.Data;
    }
    this.getRelationshipsTitles();
    this.getTitles();
    if(this.EditMode == 'Update'){
      this.getRelatedContactDetail();
    }
    // this.addNewContactForm();
  }

  private async getRelatedContactDetail(): Promise<void> {
    await this.spinnerService.loading();
    this.relateService.getRelatedContactDetail(this.ContactCode, this.RelatedContact.Id)
      .subscribe({
        next: async (_result) => {
          await this.spinnerService.end();
          this.updateData = _result;
          this.selectedRelationships = [];
          this.updateData?.RelationshipTypes?.forEach((item) => {
            this.selectedRelationships.push(item.Id);
          })
          // this.contactForm.get('TypeCtrl').setValue(this.updateData.RelationshipTypes[0].Id);
          this.contactForm.get('TitleCtrl').setValue(this.updateData.Title);
          this.contactForm.get('FamilyNameCtrl').setValue(this.updateData.FamilyName);
          this.contactForm.get('FirstNameCtrl').setValue(this.updateData.FirstName);
          this.contactForm.get('Email').setValue(this.updateData.Email);
          this.contactForm.get('Mobile').setValue(this.updateData.MobilePhone);
          this.checkEmailValidate();
          this.checkMobileValidate();
        },
        error: async (err) => {
          await this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            setTimeout(() => {
              this.closeComponent();
            }, 1000);
          }
        }
      });
  }

  private async getRelationshipsTitles(): Promise<void> {
    await this.spinnerService.loading();
    this.relateService.getRelationshipTypes()
      .subscribe({
        next: async (_result) => {
          this.typeList = _result;
          await this.spinnerService.end();
        },
        error: async (err) => {
          await this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.matErrorMessage(errResult, (title, button, content) => {
            this.matAlert.alert(content, title, button);
          });
        }
      });

  }

  private async getTitles() {
    await this.spinnerService.loading();
    this.relateService.getTitles()
      .subscribe({
        next: async (_result) => {
          await this.spinnerService.end();
          this.titleList = _result;
        },
        error: async (err) => {
          await this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.matErrorMessage(errResult, (title, button, content) => {
            this.matAlert.alert(content, title, button);
          });
        }
      });
  }

  async removeContactForm(index: number, currentGroup: ContactFormItem) {
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
            this.deleteRelatedContact(index, currentGroup);
          }
        }
      ]
    });
    await alert.present();
  }

  private async deleteRelatedContact(index: number, selComponent: ContactFormItem ){
    await this.spinnerService.loading();
    this.relateService.deleteRelatedContact(this.ContactCode, selComponent.RelatedContactId)
      .subscribe({
        next: async (_result) => {
          await this.spinnerService.end();
          this.removeContactComponent(selComponent);
        },
        error: async (err) => {
          await this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.matErrorMessage(errResult, (title, button, content) => {
            this.matAlert.alert(content, title, button);
          });
        }
      });
  }

  private removeContactComponent(selComponent){
    
    this.groupList = this.groupList.filter(item => item != selComponent);
    this.removeFormControl(selComponent.TypeCtrl);
    this.removeFormControl(selComponent.TitleCtrl);
    this.removeFormControl(selComponent.FirstNameCtrl);
    this.removeFormControl(selComponent.FamilyNameCtrl);
  }

  addFormControl(ctrlName, value, validators) {
    if (!this.contactForm.contains(ctrlName)) {
      this.contactForm.addControl(ctrlName, new UntypedFormControl(value, validators));
    }
  }

  removeFormControl(ctrlName) {
    if (this.contactForm.contains(ctrlName)) {
      this.contactForm.removeControl(ctrlName);
    }
  }

  submitContactForm() {
    if (this.contactForm.valid) {
      this.RelatedContactsNewComponent.emit(this.contactForm.value);
    }
  }

  closeComponent() {
    this.dialogRef.close();
  }


  async createContact(contactInfo: RelatedContactDetail) {    
    await this.spinnerService.loading();
    this.relateService.createRelatedContact(this.ContactCode, contactInfo)
      .subscribe({
        next: async (_result) => {
          await this.spinnerService.end();          
          this.dialogRef.close(_result?.Id);
        },
        error: async (err) => {
          await this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.matErrorMessage(errResult, (title, button, content) => {
            this.matAlert.alert(content, title, button);
          });
        }
      });
  }

  async updateContact(relateId: string, contactInfo: RelatedContactDetail) {    
    await this.spinnerService.loading();
    this.relateService.updateRelatedContact(this.ContactCode, relateId, contactInfo)
      .subscribe({
        next: async (_result) => {
          await this.spinnerService.end();
          this.dialogRef.close(this.updateData.Id);
        },
        error: async (err) => {
          await this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.matErrorMessage(errResult, (title, button, content) => {
            this.matAlert.alert(content, title, button);
          });
        }
      });
  }
  get f() {
    return this.contactForm.controls;
  }
  async updateRelatedContact(){    
    let selRelationTypes = [];
    this.selectedRelationships.forEach((item) => {
      selRelationTypes.push({
        Id: item
      });      
    });
    let contactInfo: RelatedContactDetail = {
      FamilyName: this.contactForm.get('FamilyNameCtrl').value,
      FirstName: this.contactForm.get('FirstNameCtrl').value,
      Title: this.contactForm.get('TitleCtrl').value,
      Email: this.contactForm.get('Email').value,
      Mobile: this.contactForm.get('Mobile').value,
      Gender: 'Undefined',
      RelationshipTypes: selRelationTypes,
    }
    if(this.EditMode == 'New'){
      this.createContact(contactInfo);
    }else if(this.EditMode == 'Update'){
      this.updateContact(this.updateData.Id, contactInfo);
    }
  }

  focusOutField(fieldName) {
    switch (fieldName) {
      case 'email':
        if (!this.contactForm.get('Email').hasError('email') && this.contactForm.get('Email').value) {
          this.checkEmailValidate();
        }
        
        break;
      case 'mobile':    
        if(this.contactForm.get('Mobile').value)    
          this.checkMobileValidate();
        break;
      default:
        break;
    }
  }

  async checkEmailValidate() {
    this.spinner.email = true;
    this.authService.checkEmailFormatValidate(this.globService.getFormValue(this.contactForm.get('Email').value)).subscribe(async (result: any) => {
      const formatValidateResult = this.globService.ConvertKeysToLowerCase(result);
      this.spinner.email = false;
      if (!formatValidateResult.valid) {
        this.tranService.errorToastOnly('invalid_email_format');
        this.contactForm.get('Email').setErrors({ 'invalid': true });
        this.contactForm.get('Email').markAsTouched();
      } 
    }, async (error: any) => {
      this.spinner.email = false;
      this.tranService.errorToastMessage(error);
    });
  }

  async checkMobileValidate() {
    this.spinner.mobile = true;
    let val = this.globService.getFormValue(this.contactForm.get('Mobile').value);
    this.authService.checkMobileFormatValidate(val).subscribe(async (result: any) => {
      this.spinner.mobile = false;
      const convMobileValidateResult = this.globService.ConvertKeysToLowerCase(result);
      if (!convMobileValidateResult.valid) {
        this.tranService.errorToastOnly('invalid_mobile_format');
        this.contactForm.get('Mobile').setErrors({ 'invalid_format': true });
        this.contactForm.get('Mobile').markAsTouched();
      } 
    }, async (error: any) => {
      this.spinner.mobile = false;      
      this.tranService.errorToastMessage(error);
    });
  }
  get getSaveBtnState(){    
    return !this.contactForm.valid || (this.spinner?.mobile ? true : false) || (this.spinner?.email ? true : false);
  }

  get updateTitle(){
    return (this.updateData && this.updateData?.Id) ? `[${this.updateData.Id} - ${this.updateData.FirstName} ${this.updateData.FamilyName}]` : '';
  }
}
