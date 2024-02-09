import { Component, OnInit, ViewChild, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { TranService } from 'src/services';

@Component({
  selector: 'app-account-services',
  templateUrl: './account-services.page.html',
  styleUrls: ['./account-services.page.scss'],
})
export class AccountServicesPage implements OnInit {

  @Input() ContactCode: string = '';
  @Input() ServiceId: string = '';
  @Output('AccountServicesComponent') AccountServicesComponent: EventEmitter<string> = new EventEmitter<string>();
  pageTitle: string = '';
  


  ServiceGroupId: string = '';

  constructor(
    private tranService: TranService,
  ) {

    this.tranService.translaterService();

  }

  ngOnInit() {
  }

  processServiceGroup(event) {
    if (event === 'close') {
      // this.navCtrl.pop();
      this.AccountServicesComponent.emit('close');
    } else {
      this.AccountServicesComponent.emit(event);
    }
  }

}
