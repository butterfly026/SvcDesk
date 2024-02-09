import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-new',
  templateUrl: './product-new.component.html',
  styleUrls: ['./product-new.component.scss'],
})
export class ProductNewComponent implements OnInit {
  @Input() ProductId: string = '';

  constructor() { }

  ngOnInit() { }

}
