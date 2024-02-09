import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { LoadingService, TranService, ToastService } from 'src/services';
import { ContactsIdentificationService } from './services/contacts-identification.service';

import { UntypedFormBuilder, UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ContactIdentificationMandatoryRules, ContactIdentificationMandatoryRule, ContactIdentificationType, ContactIdentification, ContactIdentificationUpdate } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-contacts-identification-component',
  templateUrl: './contacts-identification-component.page.html',
  styleUrls: ['./contacts-identification-component.page.scss'],
})
export class ContactsIdentificationComponentPage implements OnInit {

  @Output('ContactsIdentificationComponent') ContactsIdentificationComponent: EventEmitter<string> = new EventEmitter<string>();



  currentIdentList = [];
  originData = [];
  identForm: UntypedFormGroup;
  saveState: boolean = false;

  identTypeList: Array<ContactIdentificationType> = [];

  areSure: string = '';
  warning: string = '';

  private arrayLenth: number = 0;
  mandatoryList: Array<ContactIdentificationMandatoryRules> = [];
  misManList: Array<ContactIdentificationMandatoryRule> = [];

  verifiedList: boolean[] = [];

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private identService: ContactsIdentificationService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private alertCtrl: AlertController,
    private toast: ToastService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();

    this.identForm = this.formBuilder.group({

    });

    this.getContactIdentifications();

    this.tranService.convertText('are_you_sure').subscribe(value => {
      this.areSure = value;
    });

    this.tranService.convertText('your_change_lost').subscribe(value => {
      this.warning = value;
    });
  }

  ngOnInit() {

  }

  async getContactIdentifications() {
    this.currentIdentList = [];
    this.originData = [];
    this.identTypeList = [];
    this.mandatoryList = [];
    this.verifiedList = [];
    await this.loading.present();
    this.identService.ContactIdentifications().subscribe(async (result: ContactIdentification) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_contact_identification');
      } else {
        for (let i = 0; i < result.ContactIdentificationItems.length; i++) {
          let temp = {
            Code: '',
            Text: '',
            Value: '',
            Verified: false,
            Note: '',
            TypeCtrl: '',
            ValueCtrl: '',
            NoteCtrl: ''
          };
          temp.Text = result.ContactIdentificationItems[i].Detail;
          temp.Code = result.ContactIdentificationItems[i].TypeCode;
          temp.Value = result.ContactIdentificationItems[i].Detail;
          temp.Note = result.ContactIdentificationItems[i].Note;
          temp.Verified = result.ContactIdentificationItems[i].Verified;
          temp.TypeCtrl = 'contactsIdentificationType' + i;
          temp.ValueCtrl = 'contactsIdentificationValue' + i;
          temp.NoteCtrl = 'contactsIdentificationNote' + i;

          this.verifiedList.push(result.ContactIdentificationItems[i].Verified);

          this.currentIdentList.push(temp);
          this.originData.push(temp);
          this.identForm.addControl(temp.TypeCtrl, new UntypedFormControl('', Validators.required));
          this.identForm.addControl(temp.ValueCtrl, new UntypedFormControl('', Validators.required));
          this.identForm.addControl(temp.NoteCtrl, new UntypedFormControl(''));
        }
        for (let i = 0; i < this.currentIdentList.length; i++) {
          this.identForm.controls[this.currentIdentList[i].ValueCtrl].setValue(this.currentIdentList[i].Value);
          this.identForm.controls[this.currentIdentList[i].TypeCtrl].setValue(this.currentIdentList[i].Code);
          this.identForm.controls[this.currentIdentList[i].NoteCtrl].setValue(this.currentIdentList[i].Note);
        }
        this.identTypeList = result.IdentificationTypes;
        this.mandatoryList = result.ContactIdentificationMandatoryRules;
        this.arrayLenth = this.currentIdentList.length;
        this.checkSaveState('dd', 'dd', '');
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  checkSaveState(data1: any, data2: any, ctrlType: string) {
    const control = this.identForm.controls;

    if (this.currentIdentList.length === this.originData.length) {
      let sameStateCount = 0;
      for (let i = 0; i < this.originData.length; i++) {
        for (const list of this.currentIdentList) {
          const valueCtrl = list.ValueCtrl;
          const typeCtrl = list.TypeCtrl;
          const noteCtrl = list.NoteCtrl;
          if (
            this.originData[i].Value === control[valueCtrl].value &&
            this.originData[i].Code === control[typeCtrl].value &&
            this.originData[i].Note === control[noteCtrl].value &&
            this.originData[i].Verified === this.verifiedList[i]
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
      for (const list of this.currentIdentList) {
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
      for (const list of this.currentIdentList) {
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
  addNewID() {
    const newID = {
      Text: '',
      Value: '',
      Type: '',
      Note: '',
      Verified: false,
      TypeCtrl: 'contactsIdentificationType' + this.arrayLenth,
      ValueCtrl: 'contactsIdentificationValue' + this.arrayLenth,
      NoteCtrl: 'contactsIdentificationNote' + this.arrayLenth,
    }
    this.identForm.addControl(newID.TypeCtrl, new UntypedFormControl('', Validators.required));
    this.identForm.addControl(newID.ValueCtrl, new UntypedFormControl('', Validators.required));
    this.identForm.addControl(newID.NoteCtrl, new UntypedFormControl(''));
    this.identForm.controls[newID.ValueCtrl].reset();
    this.identForm.controls[newID.TypeCtrl].reset();
    this.identForm.controls[newID.NoteCtrl].reset();
    this.currentIdentList.push(newID);
    this.arrayLenth = this.arrayLenth + 1;
    this.setFocusType(newID.TypeCtrl);
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

  deleteID(index) {
    const idType = this.currentIdentList[index].TypeCtrl;
    const idValue = this.currentIdentList[index].ValueCtrl;
    const idNote = this.currentIdentList[index].NoteCtrl;
    this.identForm.removeControl(idType);
    this.identForm.removeControl(idValue);
    this.identForm.removeControl(idNote);
    this.currentIdentList.splice(index, 1);
    this.checkSaveState('sdf', 'sdf', '');
  }

  get form() {
    return this.identForm.controls;
  }

  async submitIdentification() {
    // this.navCtrl.pop();
    if (this.checkMandatoryList()) {
      if (this.identForm.valid) {
        await this.loading.present();

        let reqData: ContactIdentificationUpdate = {
          ContactCode: '',
          ContactIdentifications: [
          ]
        };
        for (let list of this.currentIdentList) {
          let tempID = {
            Id: 1,
            TypeCode: this.identForm.get(list.TypeCtrl).value,
            Status: "Valid",
            Detail: this.identForm.get(list.ValueCtrl).value,
            IssueDate: new Date().toISOString(),
            ExpiryDate: new Date().toISOString(),
            Verified: true,
            Note: this.identForm.get(list.NoteCtrl).value
          };
          reqData.ContactIdentifications.push(tempID);
        }

        this.identService.ContactIdentificationsUpdate(reqData).subscribe(async (result: any) => {
          await this.loading.dismiss();
          
          if (result === null) {
          } else {

          }
        }, async (error: any) => {
          await this.loading.dismiss();
          
          this.tranService.errorMessage(error);
        });
      }
    } else {
      this.tranService.convertText('must_have').subscribe(result => {
        let idList = '';
        for (let list of this.misManList) {
          idList += list.Type + ', ';
        }
        idList = idList + '---';
        this.toast.present(result + ' ' + idList.split(', ---')[0]);
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
            this.ContactsIdentificationComponent.emit('close');
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
      this.ContactsIdentificationComponent.emit('close');
    }
  }

  checkMandatoryList() {
    let count = 0;
    this.misManList = [];
    for (let list of this.mandatoryList[0].MandatoryIdentificationTypes) {
      let availPush = true;
      for (let lllist of this.currentIdentList) {
        if (list.TypeCode === this.identForm.get(lllist.TypeCtrl).value) {
          count++;
          availPush = false;
        }
      }
      if (availPush) {
        this.misManList.push(list);
      }
    }

    if (count === this.mandatoryList.length) {
      return true;
    } else {
      return false;
    }
  }

}
