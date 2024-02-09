import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingService, TranService } from 'src/services';
import { SMSListService } from './services/sms-list-service';

import * as $ from 'jquery';

import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-sms-list',
  templateUrl: './sms-list.component.html',
  styleUrls: ['./sms-list.component.scss'],
})
export class SmsListComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('SMSListComponent') SMSListComponent: EventEmitter<string> = new EventEmitter<string>();

  
  groupList: any[] = [];

  searchString: string = '';
  showList = [];

  SkipRecords: number = 20;
  TakeRecords: number = 0;
  CountRecords: number = 0;

  showLoading: boolean = false;
  searchedState: boolean = false;

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private smsService: SMSListService,
    public globService: GlobalService,
    
  ) {
    this.tranService.translaterService();
    
  }

  ngOnInit() {
    this.getSMSList();
    $('#sms-list-container').on('scroll', function () {
      clearTimeout($.data(this, 'scrollTimer1'));
      $.data(this, 'scrollTimer1', setTimeout(function () {
        // do something
        if ($('#sms-list-container').scrollTop() + $('#sms-list-container').innerHeight()
          >= $('#sms-list-container')[0].scrollHeight - 3) {
          document.getElementById('loadMoreButton').click();
        }
      }, 250));
    });
  }

  async getSMSList() {
    let reqData = {
      ContactCode: this.ContactCode,
      SearchString: this.searchString,
      SkipRecords: this.SkipRecords,
      TakeRecords: this.TakeRecords,
      CountRecords: this.CountRecords
    };
    await this.loading.present();
    this.smsService.getSmsSendList(reqData).subscribe(async (result: any) => {
      await this.loading.dismiss();
      if (result === null) {
      } else {
        const convResult = this.globService.ConvertKeysToLowerCase(result);
        for (let list of convResult.smss) {
          this.showList.push(list);
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  checkLoadMore() {
    if (!this.showLoading) {
      this.SkipRecords = this.SkipRecords + this.TakeRecords;
      this.getSMSList();
    }
  }

  searchInputEvent(event) {
    if (event.charCode === 13) {
      this.groupList = [];
      this.showList = [];
      this.getSMSList();
    }
  }

  switchSMSSend() {
    this.SMSListComponent.emit('sms-send');
  }

  goBack() {
    this.SMSListComponent.emit('close');
  }

}
