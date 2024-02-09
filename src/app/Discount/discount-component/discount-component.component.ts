import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-discount-component',
  templateUrl: './discount-component.component.html',
  styleUrls: ['./discount-component.component.scss'],
})
export class DiscountComponentComponent implements OnInit {
  @Input() ServiceReference: number;
  @Output('DiscountComponents') DiscountComponents: EventEmitter<string> = new EventEmitter<string>();

  discountMode: string = 'list';
  discountId: string = '';
  constructor() { }

  ngOnInit() { }

  processDiscount(event) {
    if (event === 'back') {
      this.DiscountComponents.emit('close');
    } else if (event === 'close') {
      this.discountMode = 'list';
    } else if (event === 'new') {
      this.discountMode = 'new';
    } else if (event.includes('edit')) {
      this.discountId = event.split('&&')[1];
      this.discountMode = 'edit';
    }
  }

}
