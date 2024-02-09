import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { AccountChargeAddComponent } from '../account-charge-add/account-charge-add.component';

@Component({
  selector: 'app-account-charge',
  templateUrl: './account-charge.component.html',
  styleUrls: ['./account-charge.component.scss'],
})
export class AccountChargeComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('AccountChargeComponent') AccountChargeComponent: EventEmitter<any> = new EventEmitter<any>();

  

  groupList: any[] = [];

  constructor(
    private loading: LoadingController,
    private tranService: TranService,
    
    private formBuilder: UntypedFormBuilder,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public globService: GlobalService,
  ) {
    this.globService.globSubject.next('validForm&&Charges&&true');
  }

  ngOnInit() { }

  prevForm() {
    this.AccountChargeComponent.emit('before');
  }

  nextForm() {
    if (this.groupList.length > 0) {
      this.AccountChargeComponent.emit(this.groupList);
    }
  }

  async switchEdit(index) {
    const modal = await this.modalCtrl.create({
      component: AccountChargeAddComponent,
      componentProps: {
        ChargeType: 'update',
        ChargeData: this.groupList[index],
        ContactCode: this.ContactCode,
      },
    });

    modal.onDidDismiss().then((result: any) => {
      
      if (result.data) {
        this.groupList[index] = this.globService.ConvertKeysToLowerCase(result.data);
      }
    });
    await modal.present();
  }

  async addNewCharge() {
    const modal = await this.modalCtrl.create({
      component: AccountChargeAddComponent,
      componentProps: {
        ContactCode: this.ContactCode,
      },
    });

    modal.onDidDismiss().then((result: any) => {
      
      if (result.data) {
        this.groupList.push(this.globService.ConvertKeysToLowerCase(result.data));
      }
      for (let list of this.groupList) {
        list.retailunitprice = this.globService.getCurrencyConfiguration(list.retailunitprice);
        list.totalcharge = this.globService.getCurrencyConfiguration(list.totalcharge);
      }
    });
    await modal.present();
  }

  async presentAlert(index) {
    const areSure = await this.tranService.convertText('are_you_sure').toPromise();
    const warning = await this.tranService.convertText('delete_from_list').toPromise();
    const alert = await this.alertCtrl.create({
      message: areSure,
      subHeader: warning,
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
            this.deleteIdentification(index);
          }
        }
      ]
    });
    await alert.present();
  }

  deleteIdentification(index) {
    this.groupList.splice(index, 1);
  }

  submitContractForm() {
    if (this.groupList.length > 0) {
      this.AccountChargeComponent.emit(this.groupList);
    }
  }

}
