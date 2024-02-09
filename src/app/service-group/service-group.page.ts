import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { LoadingService, TranService } from 'src/services';


import * as moment from 'moment';

@Component({
  selector: 'app-service-group',
  templateUrl: './service-group.page.html',
  styleUrls: ['./service-group.page.scss'],
})
export class ServiceGroupPage implements OnInit {

  @Input() ContactCode: string = '';
  @Input() ServiceId: string = '';


  
  serviceGroupStr: string = 'ServiceGroup';

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    
    private cdr: ChangeDetectorRef,
  ) {
    this.tranService.translaterService();
    
  }

  ngOnInit() {
    let currentDate = new Date();
    // currentDate.setDate(currentDate.getDate() + 1);
    let convertedDate = currentDate.toISOString();
  }

  processService(event) {
    if (event === 'close') {
      this.serviceGroupStr = 'ServiceGroup';
    } else if (event === 'AddService') {
      this.serviceGroupStr = 'AddService';
    } else if (event === 'refersh') {
      this.serviceGroupStr = '';
      setTimeout(() => {
        this.serviceGroupStr = 'ServiceGroup';
      }, 500);
    }
  }

}
