import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlanComponent } from 'src/app/model';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';

import { IOTBillingNewNumberService } from './services/iot-billing-new-number.service';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-iot-billing-new-number',
  templateUrl: './iot-billing-new-number.page.html',
  styleUrls: ['./iot-billing-new-number.page.scss'],
})
export class IOTBillingNewNumberPage implements OnInit {

  @Input() ContactCode: string = '';
  @Input() PlanItem: PlanComponent = {
    CallerID: true,
    CallingNumber: false,
    IddPlan: false,
    ParentalCtrl: '',
    PhoneNumber: '',
    SelButton: ''
  };

  @Output('PlanNewNumberComponent') PlanNewNumberComponent: EventEmitter<string> = new EventEmitter<string>();

  
  showList: Array<string> = [];
  numList: Array<string> = [];
  loadMoreState: boolean = false;
  searchNum: string = '';
  originNumber: string = '';

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    
    private iotService: IOTBillingNewNumberService,
    public globService: GlobalService,
  ) {
    
  }

  ngOnInit() {
    this.originNumber = this.PlanItem.PhoneNumber;
    this.getNumberList();
  }

  async getNumberList() {
    await this.loading.present();
    this.iotService.getNumberList(this.ContactCode).subscribe(async (result: string[]) => {
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_phone_numbers');
      } else {
        this.numList = result;
        if (this.numList.length > 12) {
          this.loadMoreState = true;
        } else {
          this.loadMoreState = false;
        }

        this.setShowList();
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  setShowList() {
    this.showList = [];
    if (this.loadMoreState) {
      if (this.searchNum === '') {
        for (let i = 0; i < 12; i++) {
          this.showList.push(this.convertPhoneNumber(this.numList[i]));
        }
      } else {
        for (let i = 0; i < 12; i++) {
          if (this.numList[i].includes(this.searchNum)) {
            this.showList.push(this.convertPhoneNumber(this.numList[i]));
          }
        }
      }
    } else {
      if (this.searchNum === '') {
        for (let list of this.numList) {
          this.showList.push(this.convertPhoneNumber(list));
        }
      } else {
        for (let list of this.numList) {
          if (list.includes(this.searchNum)) {
            this.showList.push(this.convertPhoneNumber(list));
          }
        }
      }
    }

    let exitState = false;
    for (let list of this.showList) {
      if (list === this.PlanItem.PhoneNumber) {
        exitState = true;
      }
    }

    if (exitState) {

    } else {
      this.PlanItem.PhoneNumber = '';
    }
  }

  convertPhoneNumber(value) {
    return value.replace(/(\d{4})/g, '$1 ').replace(/(^\s+|\s+$)/, '');
  }

  searchNumber() {
    this.setShowList();
  }

  clearSearchNum() {
    this.searchNum = '';
    this.setShowList();
  }

  selectNewNumber(index) {
    this.PlanItem.PhoneNumber = this.showList[index];
  }

  loadMoreList() {
    this.loadMoreState = false;
    this.setShowList();
  }

  goBack() {
    this.PlanItem.PhoneNumber = this.originNumber;
    this.PlanNewNumberComponent.emit('getNewNumber&' + 'close&' + JSON.stringify(this.PlanItem));
  }

  getNumber() {
    this.PlanItem.SelButton = 'NewNumber';
    this.PlanNewNumberComponent.emit('getNewNumber&' + 'select&' + JSON.stringify(this.PlanItem));
  }

}
