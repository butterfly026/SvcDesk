import { Component, OnInit } from '@angular/core';
import { TranService } from 'src/services';

@Component({
  selector: 'app-stripe-page',
  templateUrl: './stripe-page.page.html',
  styleUrls: ['./stripe-page.page.scss'],
})
export class StripePagePage implements OnInit {

  constructor(
    private tranService: TranService,
  ) { 
    this.tranService.translaterService();
  }

  ngOnInit() {
  }

}
