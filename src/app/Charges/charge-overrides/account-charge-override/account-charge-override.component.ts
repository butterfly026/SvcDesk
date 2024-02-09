import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService, ToastService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { AccountService } from './services/account-service';

@Component({
  selector: 'app-account-charge-override',
  templateUrl: './account-charge-override.component.html',
  styleUrls: ['./account-charge-override.component.scss'],
})
export class AccountChargeOverrideComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() ViewMode: string = 'List';
  @Output('AccountChargeOverrideComponent') AccountChargeOverrideComponent: EventEmitter<string> = new EventEmitter<string>();

  pageType: string = 'account-list';

  pagingParam: any = {
    pageRowNumber: 1,
    rowStep: '10',
    SkipRecords: 0,
  };

  accountDetail: any;

  constructor(
    private loading: LoadingService,
    private toast: ToastService,
    private accountService: AccountService,
    private tranService: TranService,
    
    private cdr: ChangeDetectorRef,
    private navCtrl: NavController,
    public globService: GlobalService
  ) {
    this.tranService.translaterService();
  }

  ngOnInit() {

  }

  processComponent(event) {
    if (!event.includes('&')) {
      if (event === 'close') {
        this.pageType = 'account-list';
        this.pagingParam.pageRowNumber = 1;
        this.pagingParam.rowStep = '10';
        this.pagingParam.SkipRecords = 0;
      } else if (event === 'go-back') {
        this.AccountChargeOverrideComponent.emit('close');
      }
    } else {
      let data = event.split('&');
      if (data[0] === 'accountUpdate') {
        this.accountDetail = JSON.parse(data[1]);
        this.pageType = 'update';
      } else if (data[0] === 'new') {
        this.pageType = 'new';
      }
      this.pagingParam.pageRowNumber = parseInt(data[2], 10);
      this.pagingParam.rowStep = data[3];
      this.pagingParam.SkipRecords = parseInt(data[4], 10);
    }
  }

}
