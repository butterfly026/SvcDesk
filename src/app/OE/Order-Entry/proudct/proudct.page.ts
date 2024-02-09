import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-proudct',
  templateUrl: './proudct.page.html',
  styleUrls: ['./proudct.page.scss'],
})
export class ProudctPage implements OnInit {

  @Output('ProductComponent') ProductComponent: EventEmitter<string> = new EventEmitter<string>();

  productMode: string = '';
  constructor() { }

  ngOnInit() {
  }

  goToProduct(str) {
    switch (str) {
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

  processProduct(event) {
    if (event === 'close') {
      this.productMode = '';
    }
  }

}
