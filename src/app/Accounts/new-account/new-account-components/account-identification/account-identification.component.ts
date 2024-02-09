import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { LoadingService, TranService, ToastService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { AccountIdentificationService } from './services/account-identification.service';

@Component({
  selector: 'app-new-account-identification',
  templateUrl: './account-identification.component.html',
  styleUrls: ['./account-identification.component.scss'],
})
export class AccountIdentificationComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('AccountIdentificationComponent') AccountIdentificationComponent: EventEmitter<any> = new EventEmitter<any>();

  

  idForm: UntypedFormGroup;
  groupList: any[] = [];
  availIdList: any[] = [];
  idTypeList: any[] = [];
  customerIdList: any[] = [];

  availAdd: boolean = false;
  getIdType: boolean = false;

  issueDate: any;
  createIssueDate: any;
  arrayLength: number = 0;

  constructor(
    private tranService: TranService,
    public globService: GlobalService,
    
    private formBuilder: UntypedFormBuilder,
    private idService: AccountIdentificationService,
    private loading: LoadingService,
    private alertCtrl: AlertController,
  ) {
    this.idForm = this.formBuilder.group({});
    this.tranService.translaterService();
    

    this.createIssueDate = new Date('1990-01-01');

    // this.idForm.valueChanges.subscribe(result => {
    //   this.AccountIdentificationComponent.emit(this.idForm);
    // })

    this.idForm.valueChanges.subscribe(() => {
      this.globService.globSubject.next('validForm&&Identification&&' + this.idForm.valid);
    });
  }

  ngOnInit() {
    this.getIdTypes();
  }

  get f() {
    return this.idForm.controls;
  }

  async getIdTypes() {
    await this.loading.present();
    this.idService.getIdentificationTypes().subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      this.idTypeList = this.globService.ConvertKeysToLowerCase(result);
      for (let list of this.idTypeList) {
        list.disabled = false;
      }
      // this.addIdentification();
    }, async (error: any) => {
      
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  checkAvailableIdentifications() {
    this.availIdList = [];
    for (let list of this.idTypeList) {
      let disabled = false;
      for (let group of this.groupList) {
        if (list.id === this.idForm.get(group.TypeCtrl).value) {
          disabled = true;
        }
      }
      list.disabled = disabled;
    }
  }

  addIdentification() {
    const currentGroup = {
      TypeCtrl: 'identification' + this.arrayLength,
      ValueCtrl: 'value' + this.arrayLength,
      idType: null,
      ExpireDateCtrl: 'expireDateCtrl' + this.arrayLength,
      IssueDateCtrl: 'issueDateCtrl' + this.arrayLength,
    };

    this.addFormControl(currentGroup.TypeCtrl, '', Validators.required);
    this.addFormControl(currentGroup.ValueCtrl, '', Validators.required);


    this.idForm.get(currentGroup.TypeCtrl).valueChanges.subscribe(result => {
      if (result) {
        this.checkAvailableIdentifications();
        for (let list of this.idTypeList) {
          if (result === list.id) {
            currentGroup.idType = list;
          }
        }

        this.createIssueDate = new Date('1990-01-01');
        if (currentGroup.idType.hasexpirydate) {
          this.addFormControl(currentGroup.ExpireDateCtrl, '', Validators.required);
        }

        if (currentGroup.idType.hasissuedate) {
          this.addFormControl(currentGroup.IssueDateCtrl, '', Validators.required);
          this.idForm.get(currentGroup.IssueDateCtrl).valueChanges.subscribe(result => {
            if (result) {
              currentGroup['issueDate'] = result;
            }
          })
        }
      }
    });

    this.groupList.push(currentGroup);

    this.arrayLength++;
  }

  removeNewIdentification(deleteGroup) {
    this.removeFormControl(deleteGroup.TypeCtrl);
    this.removeFormControl(deleteGroup.ValueCtrl);
    this.removeFormControl(deleteGroup.ExpireDateCtrl);
    this.removeFormControl(deleteGroup.IssueDateCtrl);

    this.groupList = this.groupList.filter(item => item != deleteGroup);
  }

  addFormControl(ctrlName, value, validators) {
    if (!this.idForm.contains(ctrlName)) {
      this.idForm.addControl(ctrlName, new UntypedFormControl(value, validators));
    }
  }

  removeFormControl(ctrlName) {
    if (this.idForm.contains(ctrlName)) {
      this.idForm.removeControl(ctrlName);
    }
  }

  prevForm() {
    this.AccountIdentificationComponent.emit('before');
  }

  nextForm() {
    document.getElementById('submitIdentificationButton').click();
  }

  submitIdForm() {
    if (this.idForm.valid) {
      this.AccountIdentificationComponent.emit(this.idForm.value);
    }
  }

}
