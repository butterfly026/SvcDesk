import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { IOTBillingExitNumberService } from './services/iot-billing-exit-number.service';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';

import { PlanComponent } from 'src/app/model';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-iot-billing-exit-number',
  templateUrl: './iot-billing-exit-number.page.html',
  styleUrls: ['./iot-billing-exit-number.page.scss'],
})
export class IOTBillingExitNumberPage implements OnInit {

  @Input() ContactCode: string = '';
  @Input() PlanItem: PlanComponent = {
    CallerID: true,
    CallingNumber: false,
    IddPlan: false,
    ParentalCtrl: '',
    PhoneNumber: '',
    SelButton: ''
  };

  @Output('PlanExistingNumberComponent') PlanExistingNumberComponent: EventEmitter<string> = new EventEmitter<string>();

  

  groupForm: UntypedFormGroup;

  telcoList = [
    { Id: 'Circle Life', Text: 'Circle Life' },
    { Id: 'M1', Text: 'M1' },
    { Id: 'My Republic', Text: 'My Republic' },
    { Id: 'Singtel', Text: 'Singtel' },
    { Id: 'Starhub', Text: 'Starhub' },
    { Id: 'iOT Mobile', Text: 'iOT Mobile' },
  ];

  statusList = [
    { Id: 'Expired', Text: 'Expired' },
    { Id: 'Not Expired', Text: 'Not Expired' },
  ];

  idTypeList = [
    { Id: 'NRIC', Text: 'NRIC' },
    { Id: 'FIN', Text: 'FIN' },
  ];

  nricState: string = 'Yes';
  idType: string = '';

  public nric = [2, 7, 6, 5, 4, 3, 2];




  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private toast: ToastService,
    
    private iotService: IOTBillingExitNumberService,
    private formBuilder: UntypedFormBuilder,
    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
  ) {
    
    this.groupForm = this.formBuilder.group({
      Number: ['', [Validators.required, Validators.pattern('[8,9]+[0-9]{7}')]],
      Telco: ['', Validators.required],
      Status: ['', Validators.required],
      FirstName: ['', Validators.required],
      FamilyName: ['', Validators.required],
      IDType: ['', Validators.required],
      NRIC: ['', [Validators.required,]],
      FIN: ['', [Validators.required,]],
      ContactNumber: ['', [Validators.required, Validators.pattern('[3,6,8,9]+[0-9]{7,9}')]]
    });
  }

  ngOnInit() {
    this.selectNricState();
  }

  get f() {
    return this.groupForm.controls;
  }

  selectNricState() {
    if (this.nricState === 'Yes') {
      this.groupForm.removeControl('FirstName');
      this.groupForm.removeControl('FamilyName');
      this.groupForm.removeControl('IDType');
      this.groupForm.removeControl('NRIC');
      this.groupForm.removeControl('FIN');
      this.groupForm.removeControl('ContactNumber');
    } else {
      this.groupForm.addControl('FirstName', new UntypedFormControl('', Validators.required));
      this.groupForm.addControl('FamilyName', new UntypedFormControl('', Validators.required));
      this.groupForm.addControl('IDType', new UntypedFormControl('', Validators.required));
      this.groupForm.addControl('NRIC', new UntypedFormControl('', [Validators.required,]));
      this.groupForm.addControl('FIN', new UntypedFormControl('', [Validators.required,]));
      this.groupForm.addControl('ContactNumber', new UntypedFormControl('', [Validators.required, Validators.pattern('[3,6,8,9]+[0-9]{7,9}')]));
      this.selectIdType(this.groupForm.get('IDType').value);
    }
  }

  selectIdType(Id) {
    if (Id === 'NRIC') {
      this.groupForm.removeControl('FIN');
      this.groupForm.addControl('NRIC', new UntypedFormControl('', [Validators.required,]));
      let temp = this.idType;
      this.idType = 'NRIC';
      if (temp === '') {
        this.cdr.detectChanges();
      }
    } else if (Id === 'FIN') {
      this.groupForm.removeControl('NRIC');
      this.groupForm.addControl('FIN', new UntypedFormControl('', [Validators.required,]));
      let temp = this.idType;
      this.idType = 'FIN';
      if (temp === '') {
        this.cdr.detectChanges();
      }
    } else {
      this.groupForm.removeControl('NRIC');
      this.groupForm.removeControl('FIN');
      this.idType = '';
    }
  }

  checkValidNRIC() {
    if (!this.getValidateNric()) {
      this.groupForm.get('NRIC').setErrors({ 'pattern': true });
    } else {
    }
  }

  getValidateNric() {
    let nricNumber = this.groupForm.get('NRIC').value;
    if (!nricNumber || nricNumber === '') { return false; }
    if (nricNumber.length !== 9) { return false; }
    let total = 0
      , count = 0
      , numericNric;
    const first = nricNumber[0]
      , last = nricNumber[nricNumber.length - 1];
    if (first !== 'S' && first !== 'T') {
      return false;
    }
    numericNric = nricNumber.substr(1, nricNumber.length - 2);
    if (isNaN(numericNric)) {
      return false;
    }
    while (numericNric !== 0) {
      total += (numericNric % 10) * this.nric[this.nric.length - (1 + count++)];
      numericNric /= 10;
      numericNric = Math.floor(numericNric);
    }
    let outputs;
    if (first === 'S') {
      outputs = ['J', 'Z', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
    } else {
      outputs = ['G', 'F', 'E', 'D', 'C', 'B', 'A', 'J', 'Z', 'I', 'H'];
    }
    return last === outputs[total % 11];
  }

  checkValidFin() {
    if (!this.getValidateFin()) {
      this.groupForm.get('FIN').setErrors({ 'pattern': true });
    } else {

    }
  }

  getValidateFin() {
    let finNumber = this.groupForm.get('FIN').value;
    if (!finNumber || finNumber === '') {
      return false;
    }
    if (finNumber.length !== 9) {
      return false;
    }
    let total = 0
      , count = 0
      , numericNric;
    const first = finNumber[0]
      , last = finNumber[finNumber.length - 1];
    if (first !== 'F' && first !== 'G') {
      return false;
    }
    numericNric = finNumber.substr(1, finNumber.length - 2);
    if (isNaN(numericNric)) {
      return false;
    }
    while (numericNric !== 0) {
      total += (numericNric % 10) * this.nric[this.nric.length - (1 + count++)];
      numericNric /= 10;
      numericNric = Math.floor(numericNric);
    }
    let outputs;
    if (first === 'F') {
      outputs = ['X', 'W', 'U', 'T', 'R', 'Q', 'P', 'N', 'M', 'L', 'K'];
    } else {
      outputs = ['R', 'Q', 'P', 'N', 'M', 'L', 'K', 'X', 'W', 'U', 'T'];
    }
    return last === outputs[total % 11];
  }

  submitExistingNumber() {
    let phoneNumber = this.groupForm.get('Number').value;
    this.PlanItem.PhoneNumber = phoneNumber.replace(/(\d{4})/g, '$1 ').replace(/(^\s+|\s+$)/, '');
    this.PlanItem.SelButton = 'ExistNumber';
    this.PlanExistingNumberComponent.emit('getNumberExit&' + 'selected&' + JSON.stringify(this.PlanItem));
  }

  submitTrigger() {
    document.getElementById('exitNumberSubmit').click();
  }

  goBack() {
    this.PlanExistingNumberComponent.emit('getNumberExit&' + 'close&' + JSON.stringify(this.PlanItem))
  }

}
