import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { TranService, LoadingService } from 'src/services';

import { OrderEntryConactService } from './services/contact.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MustMatch } from 'src/app/model/mustMatch/must-match';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class ContactPage implements OnInit {

  @Input() ContactCode: string = '';
  @Output('OrderEntryContact') OrderEntryContact: EventEmitter<string> = new EventEmitter<string>();

  

  contactMode: string = '';
  individualForm: UntypedFormGroup;
  businessForm: UntypedFormGroup;

  titleList = [
    { Id: 'Mr', Value: 'Mr' },
    { Id: 'Mrs', Value: 'Mrs' },
    { Id: 'Miss', Value: 'Miss' },
    { Id: 'Ms', Value: 'Ms' },
    { Id: 'Dr', Value: 'Dr' },
    { Id: 'Mr/s', Value: 'Mr/s' },
    { Id: 'Count', Value: 'Count' },
    { Id: 'Fr', Value: 'Fr' },
    { Id: 'Judge', Value: 'Judge' },
    { Id: 'Lady', Value: 'Lady' },
    { Id: 'Lord', Value: 'Lord' },
    { Id: 'Major', Value: 'Major' },
    { Id: 'MP', Value: 'MP' },
    { Id: 'Prof', Value: 'Prof' },
    { Id: 'Rev', Value: 'Rev' },
    { Id: 'Sir', Value: 'Sir' },
  ];

  genderList = [
    { Id: 'Male', Value: 'Male' },
    { Id: 'Female', Value: 'Female' },
    { Id: 'Other', Value: 'Other' }
  ];

  billType: string = 'email';
  resideIn: boolean = false;
  billAddress: boolean = false;
  deliveryAddress: boolean = false;

  billTypeBus: string = 'email';
  resideBus: boolean = false;
  billAddressBus: boolean = false;
  deliveryAddressBus: boolean = false;

  constructor(
    private router: Router,
    private tranService: TranService,
    private loading: LoadingService,
    
    private oeService: OrderEntryConactService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.tranService.translaterService();
    
    this.individualForm = this.formBuilder.group({
      Title: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Gender: ['', Validators.required],
      DOB: ['', Validators.required],
      PhoneNumber: ['', Validators.required],
      MobileNumber: ['', Validators.required],
      Password: ['', Validators.required],
      ConfirmPassword: ['', Validators.required],
      EmailAddress: ['', [Validators.required, Validators.email]],
      StreetAddress: ['', Validators.required],
      PreStreetAddress: ['', Validators.required],
      BillingAddress: ['', Validators.required],
      DeliveryAddress: ['', Validators.required]
    }, {
      validators: MustMatch('Password', 'ConfirmPassword')
    });

    this.businessForm = this.formBuilder.group({
      Title: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Position: ['', Validators.required],
      BusinessName: ['', Validators.required],
      TradingAs: ['', Validators.required],
      ABN: ['', Validators.required],
      ACN: ['', Validators.required],
      PhoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{8,8}')]],
      MobileNumber: ['', [Validators.required, Validators.pattern('[0-9]{8,8}')]],
      Password: ['', Validators.required],
      ConfirmPassword: ['', Validators.required],
      EmailAddress: ['', [Validators.required, Validators.email]],
      StreetAddress: ['', Validators.required],
      PreStreetAddress: ['', Validators.required],
      BillingAddress: ['', Validators.required],
      DeliveryAddress: ['', Validators.required]
    }, {
      validators: MustMatch('Password', 'ConfirmPassword')
    });

  }

  ngOnInit() {
  }

  contactModeSwitch() {
  }

  get formIn() {
    return this.individualForm.controls;
  }

  get formBu() {
    return this.businessForm.controls;
  }

  changeResideIn() {
    if (this.resideIn) {
      this.individualForm.removeControl('PreStreetAddress');
    } else {
      this.individualForm.addControl('PreStreetAddress', new UntypedFormControl('', Validators.required));
    }
  }

  billAddressIn() {
    if (this.billAddress) {
      this.individualForm.removeControl('BillingAddress');
    } else {
      this.individualForm.addControl('BillingAddress', new UntypedFormControl('', Validators.required));
    }
  }

  deliveryAddressIn() {
    if (this.deliveryAddress) {
      this.individualForm.removeControl('DeliveryAddress');
    } else {
      this.individualForm.addControl('DeliveryAddress', new UntypedFormControl('', Validators.required));
    }
  }

  changeresideBus() {
    if (this.resideBus) {
      this.businessForm.removeControl('PreStreetAddress');
    } else {
      this.businessForm.addControl('PreStreetAddress', new UntypedFormControl('', Validators.required));
    }
  }

  changeBillAddressBus() {
    if (this.billAddressBus) {
      this.businessForm.removeControl('BillingAddress');
    } else {
      this.businessForm.addControl('BillingAddress', new UntypedFormControl('', Validators.required));
    }
  }

  changeDeliveryAddressBus() {
    if (this.deliveryAddressBus) {
      this.businessForm.removeControl('DeliveryAddress');
    } else {
      this.businessForm.addControl('DeliveryAddress', new UntypedFormControl('', Validators.required));
    }
  }

}
