import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TranService, LoadingService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @Output('OrderEntryHome') OrderEntryHome: EventEmitter<string> = new EventEmitter<string>();
  
  clearState: boolean = false;
  productMode: string = '';

  constructor(
    private router: Router,
    private tranService: TranService,
    private loading: LoadingService,
    
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
  }

  ngOnInit() {
  }

  processContact(event) {
    
  }

  cancelOrder() {
    this.OrderEntryHome.emit('close')
  }

  processProduct(event) {
    if (event === 'close') {
      this.productMode = '';
    }
  }

  productHome(event) {
    switch (event) {
      case 'sigfox':
        this.productMode = 'category';
        break;
      case 'sim':
        this.productMode = 'service';
        break;
      case 'water':
        this.productMode = 'category';
        break;
      case 'security':
        this.productMode = 'category';
        break;
      case 'truck':
        this.productMode = 'service';
        break;
      case 'services':
        this.productMode = 'service';
        break;
      case 'gas':
        this.productMode = 'service';
        break;
      default:
        break;
    }
  }

  clearCart() {

  }

}
