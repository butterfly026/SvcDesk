import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { ServiceDeskNewPaymentService } from './services/new-payment.service';
import { ErrorItems } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.page.html',
  styleUrls: ['./new-payment.page.scss'],
})
export class NewPaymentPage implements OnInit {

  @Input() ContactCode: string = '';
  
  @Output('setComponentValue') public componentValue: EventEmitter<string> = new EventEmitter<string>();

  newPaymenrForm: UntypedFormGroup;
  
  methodList: any[];

  public expireMonth: any[];
  public expireYear: any[];

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private toast: ToastService,
    private cCNPService: ServiceDeskNewPaymentService,
    private cdr: ChangeDetectorRef,
    
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();

    this.newPaymenrForm = this.formBuilder.group({
      method: ['', Validators.required],
      name: ['', Validators.required],
      cardNumber: ['', [
        Validators.required,
        Validators.pattern('[0-9]{16}')
      ]],
      expireMonth: ['', Validators.required],
      expireYear: ['', Validators.required],
    });

    

    const tempMethodList = ['credit_card', 'master_card', 'debit_card'];
    this.methodList = new Array();
    for (const list of tempMethodList) {
      this.tranService.convertText(list).subscribe(value => {
        const temp = { 'type': '', 'value': '' };
        temp.type = list;
        temp.value = value;
        this.methodList.push(temp);
      });
    }

    this.expireMonth = new Array();
    this.expireYear = new Array();

    for (let i = 1; i < 13; i++) {
      this.expireMonth.push(i);
    }

    for (let i = new Date().getFullYear(); i < 2050; i++) {
      this.expireYear.push(i);
    }
  }

  ngOnInit() {
  }

  get f() { return this.newPaymenrForm.controls; }

  selectExpireYear() {
    // tslint:disable-next-line:radix
    if (parseInt(this.newPaymenrForm.controls['expireYear'].value) === new Date().getFullYear()) {
      // tslint:disable-next-line:radix
      if (parseInt(this.newPaymenrForm.controls['expireMonth'].value) < new Date().getMonth() + 1) {
        this.newPaymenrForm.controls['expireMonth'].setValue('');
        this.newPaymenrForm.controls['expireMonth'].setErrors({ 'invalid': true });
      }
      this.expireMonth = new Array();
      for (let i = new Date().getMonth() + 1; i < 13; i++) {
        this.expireMonth.push(i);
      }
    } else {
      this.expireMonth = new Array();
      for (let i = 1; i < 13; i++) {
        this.expireMonth.push(i);
      }
    }
  }

  async newPayment() {
    if (this.newPaymenrForm.valid) {

      const addParam = {
        'name': this.newPaymenrForm.controls['name'].value,
        'cardType': '',
        'cardCodeType': '',
        'number': this.newPaymenrForm.controls['cardNumber'].value,
        'expireDate': this.newPaymenrForm.controls['expireYear'].value + '-' +
          this.setTwostring(this.newPaymenrForm.controls['expireMonth'].value) + '-' +
          new Date().getDate() + 'T00:00:00'
      };
      if (this.newPaymenrForm.controls['method'].value === 'credit_card') {
        addParam.cardType = 'CC';
        addParam.cardCodeType = 'C';
      } else if (this.newPaymenrForm.controls['method'].value === 'debit_card') {
        addParam.cardType = 'DD';
        addParam.cardCodeType = 'D';
      } else {
        addParam.cardType = 'MC';
        addParam.cardCodeType = 'C';
      }

      await this.loading.present();
      this.cCNPService.addPayment(addParam).subscribe(async (result: any) => {
        await this.loading.dismiss();
        this.componentValue.emit('added');

      },async  (error: any) => {
        
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      });
    }
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  goBack() {
    this.componentValue.emit('cancel');
  }

  setTwostring(inputVal) {
    // tslint:disable-next-line:radix
    if (parseInt(inputVal) < 10) {
      return '0' + inputVal;
    } else {
      return inputVal;
    }
  }

}
