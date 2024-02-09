import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { EmailSendListService } from './services/email-send-list-service';

import * as $ from 'jquery';

@Component({
  selector: 'app-email-send-list',
  templateUrl: './email-send-list.component.html',
  styleUrls: ['./email-send-list.component.scss'],
})
export class EmailSendListComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('EmailSendListComponent') EmailSendListComponent: EventEmitter<string> = new EventEmitter<string>();

  
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
    private emailService: EmailSendListService,
    public globService: GlobalService,
    
  ) {
    this.tranService.translaterService();
    
  }

  ngOnInit() {
    this.getEmailList();
    $('#email-list-container').on('scroll', function () {
      clearTimeout($.data(this, 'scrollTimer1'));
      $.data(this, 'scrollTimer1', setTimeout(function () {
        // do something
        if ($('#email-list-container').scrollTop() + $('#email-list-container').innerHeight()
          >= $('#email-list-container')[0].scrollHeight - 3) {
          document.getElementById('loadMoreButton').click();
        }
      }, 250));
    });
  }

  async getEmailList() {
    let reqData = {
      ContactCode: this.ContactCode,
      SearchString: this.searchString,
      SkipRecords: this.SkipRecords,
      TakeRecords: this.TakeRecords,
      CountRecords: this.CountRecords
    };
    await this.loading.present();
    this.emailService.getEmailsSendList(reqData).subscribe(async (result: any) => {
      await this.loading.dismiss();
      if (result === null) {
      } else {
        const convResult = this.globService.ConvertKeysToLowerCase(result);
        for (let list of convResult.list) {
          this.showList.push(list);
        }
        for (let list of this.showList) {
          this.showList['attachState'] = false;
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  mouseEnterAttach(index) {
    this.showList[index].attachState = true;
  }

  moustLeaveAttach(index) {
    this.showList[index].attachState = false;
  }

  checkLoadMore() {
    if (!this.showLoading) {
      this.SkipRecords = this.SkipRecords + this.TakeRecords;
      this.getEmailList();
    }
  }

  searchInputEvent(event) {
    if (event.charCode === 13) {
      this.groupList = [];
      this.showList = [];
      this.getEmailList();
    }
  }

  switchEmailNew() {
    this.EmailSendListComponent.emit('new');
  }

  goBack() {
    this.EmailSendListComponent.emit('close');
  }

}
