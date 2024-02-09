import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService } from 'src/services/global-service.service';
import { ChargeItem } from '../charges.types';

@Component({
  selector: 'app-charge-detail',
  templateUrl: './charge-detail.component.html',
  styleUrls: ['./charge-detail.component.scss'],
})
export class ChargeDetailComponent implements OnInit {

  chargeForm: FormGroup;
  chargeDetail: ChargeItem;
  title: string;
  totalCharge: number = 0;
  moreState: boolean = false;
  quentityOptions = {
    align: 'left',
    allowNegative: true,
    decimal: '.',
    precision: 0,
    prefix: '',
    suffix: '',
    thousands: ',',
  };

  discountTypeList: any[] = [
    { id: 'None', name: 'none' },
    { id: 'Percentage', name: 'percentage' },
    { id: 'Fixed', name: 'fixed' }
  ];

  constructor(
    public globService: GlobalService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { chargeData: ChargeItem; }
  ) { }

  ngOnInit() {    
    this.chargeDetail = this.data.chargeData;
    this.title = `[${this.chargeDetail.Id} - ${this.chargeDetail.Description}]`;

    this.chargeForm = this.formBuilder.group({
      ...this.chargeDetail,
      From: this.globService.getDateTimeWithString('YYYY-MM-DDTHH:mm', this.chargeDetail.From),
      DiscountType: 'None',
      Note: ''
    });

    if (this.chargeDetail.DiscountPercentage && !this.chargeDetail.DiscountAmount) {
      this.chargeForm.get('DiscountType').setValue('None');
    } else if (this.chargeDetail.DiscountPercentage && this.chargeDetail.DiscountAmount > 0) {
      this.chargeForm.get('DiscountType').setValue('Percentage');
      this.chargeForm.get('Quantity').setValue(this.chargeDetail.DiscountPercentage);
    } else {
      this.chargeForm.get('DiscountType').setValue('Fixed');
      this.chargeForm.get('Quantity').setValue(this.chargeDetail.DiscountAmount);
    }

    this.chargeForm.disable();
  }

  get f() {
    return this.chargeForm.controls;
  }

  changeMoreState() {
    this.moreState = !this.moreState;
  }

}
