import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranService } from 'src/services';
import { FormBuilder } from '@angular/forms';

import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-new-recharge',
  templateUrl: './new-recharge.page.html',
  styleUrls: ['./new-recharge.page.scss'],
})
export class NewRechargePage implements OnInit {

  
  pageTitle: string = '';

  constructor(
    private router: Router,
    private tranService: TranService,
    
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();

    
    this.tranService.convertText('recharge').subscribe(result => {
      this.pageTitle = result;
    });
  }

  ngOnInit() {
  }

  orderRecharge(index) {
  }

}
