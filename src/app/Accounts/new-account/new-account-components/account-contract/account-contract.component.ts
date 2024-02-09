import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { AccountContractCommitmentComponent } from '../account-contract-commitment/account-contract-commitment.component';
import { AccountContractService } from './services/account-contract.service';

@Component({
  selector: 'app-account-contract',
  templateUrl: './account-contract.component.html',
  styleUrls: ['./account-contract.component.scss'],
})
export class AccountContractComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('AccountContractComponent') AccountContractComponent: EventEmitter<any> = new EventEmitter<any>();

  
  contractForm: UntypedFormGroup;

  contractList: any[] = [
    { id: 'Standard', name: 'Standard' },
    { id: 'Normal', name: 'Normal' },
  ];

  eftList: any[] = [
    { id: 'Standard', name: 'Standard' },
    { id: 'Normal', name: 'Normal' }
  ];

  commitmentList: any[] = [
    { type: 'Revenue', month: 12, thresholdvalue: 10000, penaltymethod: 'Penalty 1' },
    { type: 'Revenue', month: 24, thresholdvalue: 20000, penaltymethod: 'Penalty 2' },
    { type: 'Units', month: 12, thresholdvalue: 500, penaltymethod: 'Penalty 3' },
  ];


  constructor(
    private loading: LoadingController,
    private tranService: TranService,
    
    private contractService: AccountContractService,
    private formBuilder: UntypedFormBuilder,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public globService: GlobalService,
  ) {
    
    this.contractForm = this.formBuilder.group({
      Contract: ['', Validators.required],
      Number: ['', Validators.required],
      TermMonths: ['', Validators.required],
      ETFMethod: ['', Validators.required],
      AutoRenew: [''],
      RenewalTerms: ['', Validators.required],
    });

    this.contractForm.valueChanges.subscribe(() => {
      this.globService.globSubject.next('validForm&&Contracts&&' + this.contractForm.valid);
    });

    for (let list of this.commitmentList) {
      list.thresholdvalue = this.globService.getCurrencyConfiguration(list.thresholdvalue);
    }
  }

  ngOnInit() { }

  prevForm() {
    this.AccountContractComponent.emit('before');
  }

  nextForm() {
    if (this.contractForm.valid) {
      let contractValues = {};
      contractValues = this.contractForm.value;
      contractValues['commitmentList'] = this.commitmentList;
      this.AccountContractComponent.emit(contractValues);
    }
  }

  async switchEdit(index) {
    const modal = await this.modalCtrl.create({
      component: AccountContractCommitmentComponent,
      componentProps: {
        ContractData: this.commitmentList[index],
      },
    });

    modal.onDidDismiss().then((result: any) => {
      
      if (result.data) {

        for (var key in result.data) {
          this.commitmentList[index][key.toLowerCase()] = result.data[key];
        }
      }
    });
    await modal.present();
  }

  async addNewCommitment() {
    const modal = await this.modalCtrl.create({
      component: AccountContractCommitmentComponent,
    });

    modal.onDidDismiss().then((result: any) => {
      
      if (result.data) {
        this.commitmentList.push(this.globService.ConvertKeysToLowerCase(result.data));
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
    this.commitmentList.splice(index, 1);
  }

  submitContractForm() {
    this.nextForm();
  }

}
