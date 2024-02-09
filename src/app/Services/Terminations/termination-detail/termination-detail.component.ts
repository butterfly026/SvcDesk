import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentOutValue, TerminationDetailItem } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';

import { TerminationDetailService } from './services/termination-detail-service';

@Component({
  selector: 'app-termination-detail',
  templateUrl: './termination-detail.component.html',
  styleUrls: ['./termination-detail.component.scss'],
})
export class TerminationDetailComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() terminationDate: Date = null;
  @Input() ServiceReference: string = '';

  @Output('TerminationDetailComponent') TerminationDetailComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();



  termDetail: Array<TerminationDetailItem> = [];
  selectedIndex = 0;
  termDetailService: Array<TerminationDetailItem> = [];

  panelData = [{
    TerminationType: 'General',
    TerminationList: [
      { Label: 'Contract Code', Value: null },
      { Label: 'Contract Description', Value: null },
      { Label: 'Contract Term', Value: null },
      { Label: 'Notice Period', Value: null },
      { Label: 'Cool-off Period', Value: null }
    ]
  },
  {
    TerminationType: 'Penalty',
    TerminationList: [
      { Label: 'Disconnection Fee (ex. Tax)', Value: null },
      { Label: 'Calculation Method', Value: null },
      { Label: 'Applicable Charge Code', Value: null }
    ]
  }];

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private TDService: TerminationDetailService,
    private alertService: AlertService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();

  }

  goBack() {
    this.TerminationDetailComponent.emit({ type: 'terminationService' });
  }

  async getGeneralData() {
    this.termDetail = [];
    await this.loading.present();
    this.TDService.getTerminationsPenalty(this.ServiceReference, this.terminationDate).subscribe(async (result: any) => {
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_termination_detail');
      } else {
        const convResult = this.globService.ConvertKeysToLowerCase(result);
        this.panelData[0].TerminationList[0].Value = convResult.contractinstanceid;
        this.panelData[0].TerminationList[1].Value = convResult.contract;
        this.panelData[0].TerminationList[2].Value = this.getUnitsValue(convResult.contractterm, convResult.contracttermunits);
        this.panelData[0].TerminationList[3].Value = this.getUnitsValue(convResult.noticeterm, convResult.noticetermunits);
        this.panelData[0].TerminationList[4].Value = this.getUnitsValue(convResult.cooloffdays, 'Daily');

        this.panelData[1].TerminationList[0].Value = convResult.penaltyfee;
        this.panelData[1].TerminationList[1].Value = convResult.contractpenaltycalculationmethod;
        this.panelData[1].TerminationList[2].Value = convResult.contractpenaltycalculationmethodcode;
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
      setTimeout(() => {
        this.alertService.closeAllAlerts();
        this.TerminationDetailComponent.emit({ type: 'close' });
      }, 5000);
    });
  }

  getUnitsValue(value, type) {
    if (value === 1 || value === 0) {
      return value + ' ' + this.getUnit(type).type1;
    } else if (value > 1) {
      return value + ' ' + this.getUnit(type).type2;
    } else {
      return null;
    }
  }

  getUnit(type) {
    switch (type) {
      case 'Monthly':
        return { type1: 'Month', type2: 'Months' };
      case 'Yearly':
        return { type1: 'Year', type2: 'Years' };
      case 'Daily':
        return { type1: 'Day', type2: 'Days' };
      default:
        break;
    }
  }

  async getServiceData() {
    this.termDetailService = [];
    await this.loading.present();
    this.TDService.getTerminateService().subscribe(async (result: TerminationDetailItem[]) => {

      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_termination_detail');
      } else {
        for (const list of result) {
          this.termDetailService.push(list);
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  selectTabs(en: any) {
    this.selectedIndex = en.index;
    switch (this.selectedIndex) {
      case 0:
        this.getGeneralData();
        break;
      default:
        this.getServiceData();
        break;
    }
  }

  ngOnInit() {
    this.getGeneralData();
  }

  ngAfterViewChecked() {
  }

  overTable(index) {
    const element = document.getElementsByClassName('customeTableTermGeneralDetail' + index);
    for (let j = 0; j < element.length; j++) {
      const elementDetail = element[j].getElementsByClassName('custom-table-body-td');
      for (let i = 0; i < elementDetail.length; i++) {
        elementDetail[i].classList
          .add('jqx-fill-state-hover', 'jqx-fill-state-hover-' + this.globService.themeColor);
      }
    }
  }

  leaveTable(index) {
    const element = document.getElementsByClassName('customeTableTermGeneralDetail' + index);
    for (let j = 0; j < element.length; j++) {
      const elementDetail = element[j].getElementsByClassName('custom-table-body-td');
      for (let i = 0; i < elementDetail.length; i++) {
        elementDetail[i].classList
          .remove('jqx-fill-state-hover', 'jqx-fill-state-hover-' + this.globService.themeColor);
      }
    }
  }

  overTableList(indexI, indexJ) {
    const element = document.getElementsByClassName('customeTableTermGeneralDetailList' + indexI + indexJ);
    for (let j = 0; j < element.length; j++) {
      const elementDetail = element[j].getElementsByClassName('custom-table-body-td');
      for (let i = 0; i < elementDetail.length; i++) {
        elementDetail[i].classList
          .add('jqx-fill-state-hover', 'jqx-fill-state-hover-' + this.globService.themeColor);
      }
    }
  }

  leaveTableList(indexI, indexJ) {
    const element = document.getElementsByClassName('customeTableTermGeneralDetailList' + indexI + indexJ);
    for (let j = 0; j < element.length; j++) {
      const elementDetail = element[j].getElementsByClassName('custom-table-body-td');
      for (let i = 0; i < elementDetail.length; i++) {
        elementDetail[i].classList
          .remove('jqx-fill-state-hover', 'jqx-fill-state-hover-' + this.globService.themeColor);
      }
    }
  }

}
