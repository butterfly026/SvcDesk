import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { LoadingService, TranService, ToastService } from 'src/services';

import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AliasType, ContactNames, Titles, ContactNameUpdate, ContactAliasUpdateItem } from 'src/app/model';
import { AccountNamesService } from './services/account-names.service';
import { GlobalService } from 'src/services/global-service.service';
import { AccountNewService } from '../../../new-account/services/new-account.service';
@Component({
  selector: 'app-account-names',
  templateUrl: './account-names.component.html',
  styleUrls: ['./account-names.component.scss'],
})
export class AccountNamesComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() NameAccountType: string = '';  
  @Output('AccountNamesComponent') AccountNamesComponent: EventEmitter<string> = new EventEmitter<string>();



  groupList = [];
  originData = [];
  groupForm: UntypedFormGroup;
  saveState: boolean = false;

  typeList: Array<AliasType> = [];
  titleList: Array<Titles> = [];

  areSure: string = '';
  warning: string = '';

  private arrayLenth: number = 0;
  switchState: string = 'default';  
  contactData = {
    Name: '',
    FirstName: '',
    Title: '',
  };

  ContactType: string = '';

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private cAService: AccountNamesService,
    private accountSvc: AccountNewService,
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private alertCtrl: AlertController,
    private toast: ToastService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();


    this.groupForm = this.formBuilder.group({
    });

    this.tranService.convertText('are_you_sure').subscribe(value => {
      this.areSure = value;
    });
    this.tranService.convertText('your_change_lost').subscribe(value => {
      this.warning = value;
    });

  }

  ngOnInit() {
    
    this.getAliasType();
    this.getTitles();
  }

  

  async getAliasType() {
    // await this.loading.present();
    this.cAService.AliasTypes().subscribe(async (result: AliasType[]) => {
      
      this.typeList = result;
    }, async (error: any) => {
      // await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  async getTitles() {
    // await this.loading.present();
    this.cAService.Titles().subscribe(async (result: Titles[]) => {
      
      this.titleList = result;
    }, async (error: any) => {
      // await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  async getContactType() {
    this.groupList = [];
    this.originData = [];
    this.typeList = [];
    this.titleList = [];

        this.arrayLenth = this.groupList.length;
        this.checkSaveState('dd', 'dd', '');
    
  }

  checkSaveState(data1: any, data2: any, ctrlType: string) {
    const control = this.groupForm.controls;

    if (this.groupList.length === this.originData.length) {
      let sameStateCount = 0;
      for (let i = 0; i < this.originData.length; i++) {
        for (const list of this.groupList) {
          const valueCtrl = list.ValueCtrl;
          const typeCtrl = list.TypeCtrl;
          if (
            this.originData[i].Value === control[valueCtrl].value &&
            this.originData[i].Code === control[typeCtrl].value
          ) {
            sameStateCount++;
          }
        }
      }
      if (sameStateCount === this.originData.length) {
        this.saveState = false;
      } else {
        this.saveState = true;
      }
    } else {
      this.saveState = true;
    }

    let contactState = true;
    if (this.NameAccountType === 'person') {
      if (this.contactData.Name === this.groupForm.get('Name').value &&
        this.contactData.FirstName === this.groupForm.get('FirstName').value &&
        this.contactData.Title === this.groupForm.get('Title').value) {
        contactState = false;
      } else {
        contactState = true;
      }
    } else if (this.NameAccountType === 'corporation') {
      if (this.contactData.Name === this.groupForm.get('Name').value) {
        contactState = false;
      } else {
        contactState = true;
      }
    }

    if (this.saveState || contactState) {
      this.saveState = true;
    } else {
      this.saveState = false;
    }


    if (ctrlType === '') {
    } else if (ctrlType === 'ValueCtrl') {
      for (const list of this.groupList) {
        if (list.ValueCtrl !== data2 && control[list.ValueCtrl].value === control[data2].value &&
          control[list.TypeCtrl].value === control[data1].value
        ) {
          this.tranService.convertText('cant_input_same_value').subscribe(value => {
            this.toast.present(value);
          });
          control[data2].reset();
        }
      }
    } else if (ctrlType === 'TypeCtrl') {
      for (const list of this.groupList) {
        if (list.ValueCtrl !== data2 && control[list.ValueCtrl].value === control[data2].value &&
          control[list.TypeCtrl].value === control[data1].value
        ) {
          this.tranService.convertText('cant_input_same_value').subscribe(value => {
            this.toast.present(value);
          });
          control[data1].reset();
        }
      }
    }
  }

  

  setFocusType(idName) {
    if (document.getElementById(idName) === null || typeof (document.getElementById(idName)) === 'undefined') {
      setTimeout(() => {
        this.setFocusType(idName);
      }, 500);
    } else {
      document.getElementById(idName).click();
    }
  }

  addNewGroup() {
    let idx = this.accountSvc.getValidIdx(this.groupList);
    const newGroup = {
      Text: '',
      Value: '',
      Type: '',
      TypeCtrl: 'contactAliasType' + idx,
      ValueCtrl: 'contactAliasName' + idx,
      idx: idx,
    }
    this.groupForm.addControl(newGroup.TypeCtrl, new UntypedFormControl('', Validators.required));
    this.groupForm.addControl(newGroup.ValueCtrl, new UntypedFormControl('', Validators.required));
    this.groupForm.controls[newGroup.ValueCtrl].reset();
    this.groupForm.controls[newGroup.TypeCtrl].reset();
    this.groupList.push(newGroup);
    this.arrayLenth = this.arrayLenth + 1;
    // this.setFocusType(newGroup.TypeCtrl);
  }

  deleteGroup(index) {
    const Type = this.groupList[index].TypeCtrl;
    const Value = this.groupList[index].ValueCtrl;
    this.groupForm.removeControl(Type);
    this.groupForm.removeControl(Value);
    this.groupList.splice(index, 1);
    this.checkSaveState('sdf', 'sdf', '');
  }

  get form() {
    return this.groupForm.controls;
  }

  async submitGroup() {
    // this.navCtrl.pop();
    if (this.groupForm.valid) {
      await this.loading.present();

      let reqDataBusiness: ContactNameUpdate = {
        ContactCode: this.ContactCode,
        Name: this.groupForm.get('Name').value,
        FirstName: this.groupForm.get('Name').value,
        Initials: this.groupForm.get('Name').value,
        Title: this.groupForm.get('Name').value,
        ContactAliases: Array<ContactAliasUpdateItem>()
      };

      let reqDataPersonal = {
        ContactCode: this.ContactCode,
        Name: this.groupForm.get('Name').value,
        ContactAliases: Array<ContactAliasUpdateItem>()
      }

      this.originData = [];
      for (let list of this.groupList) {
        let tempPhone = {
          "TypeCode": this.groupForm.get(list.TypeCtrl).value,
          "Alias": this.groupForm.get(list.ValueCtrl).value,
        };
        reqDataBusiness.ContactAliases.push(tempPhone);
        reqDataPersonal.ContactAliases.push(tempPhone);

        list.Code = this.groupForm.get(list.TypeCtrl).value;
        list.Value = this.groupForm.get(list.ValueCtrl).value;

        let temp = {
          Code: '',
          Text: '',
          Value: '',
          TypeCtrl: '',
          ValueCtrl: '',
        };
        temp.Text = list.Text;
        temp.Code = list.Code;
        temp.Value = list.Value;
        temp.TypeCtrl = list.TypeCtrl;
        temp.ValueCtrl = list.ValueCtrl;

        this.originData.push(temp);
      }

      let reqBody;

      if (this.NameAccountType === 'person') {
        reqBody = reqDataBusiness;
      } else if (this.NameAccountType === 'corporation') {
        reqBody = reqDataPersonal;
      }

      this.cAService.ContactNamesUpdate(this.globService.convertRequestBody(reqBody)).subscribe(async (result: any) => {
        await this.loading.dismiss();
        
        this.AccountNamesComponent.emit(reqBody.Name);
        // this.checkSaveState('', '', '');
        this.saveState = false;
      }, async (error: any) => {
        await this.loading.dismiss();
        
        this.tranService.errorMessage(error);
      });
    }
  }

  async presentAlert() {
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
            
            // this.navCtrl.pop();
            this.AccountNamesComponent.emit('close');
          }
        }
      ]
    });
    await alert.present();
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  goBack() {
    if (this.saveState) {
      this.presentAlert();
    } else {
      // this.navCtrl.pop();
      this.AccountNamesComponent.emit('close');
    }
  }

  goToAliasHistory() {
    this.switchState = 'alias_history';
  }

  goToNameHistory() {
    this.switchState = 'name_history';
  }

  processHistory(event) {
    if (event === 'close') {
      this.switchState = 'default';
    }
  }

  public getSubmitData(){
    let submitData = {
      Aliases: []
    }
    
    return submitData;
}

}
