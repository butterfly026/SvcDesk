import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { ServiceDeskUpdatePaymentService } from './services/update-payment.service';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ErrorItems } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-update-payment',
  templateUrl: './update-payment.page.html',
  styleUrls: ['./update-payment.page.scss'],
})
export class UpdatePaymentPage implements OnInit {

  @Input() ContactCode: string = '';
  @Input() PaymentId: string = '';

  @Output('setComponentValue') public componentValue: EventEmitter<string> = new EventEmitter<string>();

  updatePaymenrForm: UntypedFormGroup;
  

  expireMonth: any[];
  expireYear: any[];

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private toast: ToastService,
    private cCUPService: ServiceDeskUpdatePaymentService,
    private cdr: ChangeDetectorRef,
    
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();

    // this.tranService.convertText('update_payment').subscribe(value => {
    //   this.pageTitle = value;
    // });

    this.updatePaymenrForm = this.formBuilder.group({
      name: ['VeeR Hunter', Validators.required],
      cardNumber: ['1234123412341234', [
        Validators.required
      ]],
      expireMonth: ['', Validators.required],
      expireYear: ['', Validators.required],
    });

    this.updatePaymenrForm.controls['cardNumber'].disable();
    this.updatePaymenrForm.controls['name'].disable();

    

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

  selectExpireYear() {
    // tslint:disable-next-line:radix
    if (parseInt(this.updatePaymenrForm.controls['expireYear'].value) === new Date().getFullYear()) {
      // tslint:disable-next-line:radix
      if (parseInt(this.updatePaymenrForm.controls['expireMonth'].value) < new Date().getMonth() + 1) {
        this.updatePaymenrForm.controls['expireMonth'].setValue('');
        this.updatePaymenrForm.controls['expireMonth'].setErrors({ 'invalid': true });
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
    if (this.updatePaymenrForm.valid) {

      const addParam = {
        'name': this.updatePaymenrForm.controls['name'].value,
        'cardType': '',
        'cardCodeType': '',
        'number': this.updatePaymenrForm.controls['cardNumber'].value,
        'expireDate': this.updatePaymenrForm.controls['expireYear'].value + '-' +
          this.setTwostring(this.updatePaymenrForm.controls['expireMonth'].value) + '-' +
          new Date().getDate() + 'T00:00:00'
      };

      await this.loading.present();
      this.cCUPService.updatePayment(addParam).subscribe(async (result: any) => {
        await this.loading.dismiss();
        this.componentValue.emit('added');

      }, async (error: any) => {
        
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
