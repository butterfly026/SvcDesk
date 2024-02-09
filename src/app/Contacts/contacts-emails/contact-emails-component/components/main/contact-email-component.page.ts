import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { NavController, AlertController } from '@ionic/angular';

import { LoadingService, TranService, ToastService } from 'src/services';
import { CustomerEmailItem, ContactEmailUsage, ContactEmailType, ContactEmailMandatoryRule } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';
import { ContactEmailsService } from '../../services';

@Component({
  selector: 'app-contact-email-component',
  templateUrl: './contact-email-component.page.html',
  styleUrls: ['./contact-email-component.page.scss'],
})
export class ContactEmailComponentPage implements OnInit {

  @Input() ContactCode: string = '';
  @Output('ContactEmailComponent') ContactEmailComponent: EventEmitter<string> = new EventEmitter<string>();

  pageTitle: string = '';


  currentEmailList = [];
  originData = [];
  emailForm: UntypedFormGroup;
  saveState: boolean = false;

  emailTypeList: Array<ContactEmailType> = [];
  availEmailList: Array<ContactEmailType> = [];

  areSure: string = '';
  warning: string = '';

  private arrayLenth: number = 0;
  emailState: string = 'default';
  mandatoryList: Array<ContactEmailMandatoryRule> = [];
  misManList: Array<ContactEmailMandatoryRule> = [];

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private cEService: ContactEmailsService,

    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private alertCtrl: AlertController,
    private toast: ToastService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('customer_emails').subscribe(value => {
      this.pageTitle = value;
    });

    this.emailForm = this.formBuilder.group({

    });

    this.tranService.convertText('are_you_sure').subscribe(value => {
      this.areSure = value;
    });
    this.tranService.convertText('your_change_lost').subscribe(value => {
      this.warning = value;
    });

  }

  async getEmailList() {
    this.currentEmailList = [];
    this.originData = [];
    this.emailTypeList = [];
    this.mandatoryList = [];
    await this.loading.present();
    this.cEService.getEmailList(this.ContactCode).subscribe(async (result: ContactEmailUsage) => {
      
      let convResult = this.globService.ConvertKeysToLowerCase(result);
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_emails');
      } else {
        let index = 0;
        for (let i = 0; i < convResult.contactemailusages.length; i++) {
          let emailTypesList = convResult.contactemailusages[i].emailtypes;
          for (let list of emailTypesList) {
            let temp = {
              Code: '',
              Text: '',
              Value: '',
              TypeCtrl: '',
              ValueCtrl: '',
            };
            temp.Text = list.name;
            temp.Code = list.code;
            temp.Value = convResult.contactemailusages[i].emailaddress;
            temp.TypeCtrl = 'customerEmailType' + index;
            temp.ValueCtrl = 'customerEmailValue' + index;

            this.currentEmailList.push(temp);
            this.originData.push(temp);
            this.emailForm.addControl(temp.TypeCtrl, new UntypedFormControl('', Validators.required));
            this.emailForm.addControl(temp.ValueCtrl, new UntypedFormControl('', [Validators.required, Validators.email]));
            index++;
          }
        }
        for (let i = 0; i < this.currentEmailList.length; i++) {
          this.emailForm.controls[this.currentEmailList[i].ValueCtrl].setValue(this.currentEmailList[i].Value);
          this.emailForm.controls[this.currentEmailList[i].TypeCtrl].setValue(this.currentEmailList[i].Code);
        }
        this.emailTypeList = convResult.contactemailtypes;
        this.mandatoryList = convResult.contactemailmandatoryrules;
        this.arrayLenth = this.currentEmailList.length;
        this.checkSaveState('', '', '');
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  checkSaveState(data1: any, data2: any, ctrlType: string) {
    const control = this.emailForm.controls;

    if (this.currentEmailList.length === this.originData.length) {
      let sameStateCount = 0;
      for (let i = 0; i < this.originData.length; i++) {
        for (const list of this.currentEmailList) {
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


    if (ctrlType === '') {
    } else if (ctrlType === 'ValueCtrl') {
      for (const list of this.currentEmailList) {
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
      for (const list of this.currentEmailList) {
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
    this.checkAvailableEmail();
  }

  ngOnInit() {
    this.getEmailList();
  }

  addNewEmail() {
    const newEmail = {
      Text: '',
      Value: '',
      Code: '',
      TypeCtrl: 'customerEmailType' + this.arrayLenth,
      ValueCtrl: 'customerEmailValue' + this.arrayLenth,
    }
    this.emailForm.addControl(newEmail.TypeCtrl, new UntypedFormControl('', Validators.required));
    this.emailForm.addControl(newEmail.ValueCtrl, new UntypedFormControl('', [Validators.required, Validators.email]));
    this.emailForm.controls[newEmail.ValueCtrl].reset();
    this.emailForm.controls[newEmail.TypeCtrl].reset();
    this.currentEmailList.push(newEmail);
    this.arrayLenth = this.arrayLenth + 1;
    this.setFocusType(newEmail.TypeCtrl);
    this.checkSaveState('', '', '');
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

  deleteEmail(index) {
    const emailType = this.currentEmailList[index].TypeCtrl;
    const emailValue = this.currentEmailList[index].ValueCtrl;
    this.emailForm.removeControl(emailValue);
    this.emailForm.removeControl(emailType);
    this.currentEmailList.splice(index, 1);
    this.checkSaveState('', '', '');
  }

  get form() {
    return this.emailForm.controls;
  }

  async submitEmail() {
    // this.navCtrl.pop();
    if (this.checkMandatoryList()) {
      if (this.emailForm.valid) {
        await this.loading.present();
        let reqData = {
          "contactCode": this.ContactCode,
          "contactEmailUsage": [
          ]
        };
        this.originData = [];
        for (let i = 0; i < this.currentEmailList.length; i++) {
          let list = this.currentEmailList[i];
          let tempPhone = {
            "emailAddress": this.emailForm.get(list.ValueCtrl).value,
            "emailTypes": [
              {
                "code": this.emailForm.get(list.TypeCtrl).value
              }
            ]
          };
          reqData.contactEmailUsage.push(tempPhone);

          list.Code = this.emailForm.get(list.TypeCtrl).value;
          list.Value = this.emailForm.get(list.ValueCtrl).value;

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
        this.cEService.ContactEmailUsageUpdate(reqData).subscribe(async (result: any) => {
          await this.loading.dismiss();
          
          if (result === null) {
          } else {

          }
          let currentEmailString = '';
          for (let list of this.currentEmailList) {
            if (currentEmailString === '') {
              currentEmailString = currentEmailString + list.Value;
            } else {
              currentEmailString = currentEmailString + ', ' + list.Value;
            }
          }
          this.ContactEmailComponent.emit(currentEmailString);
          this.checkSaveState('', '', '');
          // this.tranService.convertText('contact_email_updated').subscribe(result => {
          //   this.toast.present(result);
          //   setTimeout(() => {
          //     this.goBack();
          //   }, 3000);
          // });
          this.tranService.errorMessageWithTime('contact_email_updated');
          setTimeout(() => {
            this.goBack();
          }, 2000);
        }, async (error: any) => {
          await this.loading.dismiss();
          
          this.tranService.errorMessage(error);
        });
      }
    } else {
      this.tranService.convertText('must_have').subscribe(result => {
        let emailList = '';
        for (let list of this.misManList) {
          emailList += list.type + ', ';
        }
        emailList = emailList + '---';
        this.toast.present(result + ' ' + emailList.split(', ---')[0]);
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
            this.ContactEmailComponent.emit('close');
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
      this.ContactEmailComponent.emit('close');
    }
  }

  goToHistory() {
    this.emailState = 'history';
  }

  checkMandatoryList() {
    let count = 0;
    this.misManList = [];
    let tempArray = [];
    for (let list of this.mandatoryList) {
      let item = {
        TypeCode: list.typecode,
        Type: list.type
      };
      tempArray.push(item);
      if (list.type === null && list.typecode === null) {
        count++;
      }
    }
    for (let i = 0; i < this.mandatoryList.length; i++) {
      let list = this.mandatoryList[i]
      let availPush = true;
      for (let lllist of this.currentEmailList) {
        if (list.typecode === this.emailForm.get(lllist.TypeCtrl).value) {
          // count++;
          availPush = false;
          // tempArray.splice(i, 1);
          tempArray.pop();
        }
      }
      if (availPush) {
        this.misManList.push(list);
      }
    }

    if (count === this.mandatoryList.length) {
      return true;
    } else {
      if (tempArray.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  processHistory(event) {
    if (event === 'close') {
      this.emailState = 'default';
      this.ContactEmailComponent.emit('close-history');
    }
  }

  checkAvailableEmail() {
    this.availEmailList = this.emailTypeList.filter(it => {
      if (this.currentEmailList.filter(item => this.emailForm.get(item.TypeCtrl).value === 'PE').length > 0 && it.code === 'PE') {
        it['available'] = true;
      } else {
        it['available'] = false;
      }

      return it;

    });
    // const temp = this.currentEmailList.map(it}em => this.emailForm.get(item.TypeCtrl).value);
  
  }

}
