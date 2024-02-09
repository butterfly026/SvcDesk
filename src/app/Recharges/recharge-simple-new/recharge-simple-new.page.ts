import { Component, OnInit, ChangeDetectorRef, HostListener, AfterViewChecked, Inject } from '@angular/core';
import { RechargeSimpleNewService } from './services/recharge-simple-new.service';
import { NavController, AlertController } from '@ionic/angular';
import { ToastService, LoadingService, TranService } from 'src/services';

import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { RechargeListItem, ErrorItems, RechargeSimpleNewItem, CustomerPaymentMethodListItem, RechargeAddNew, DefaultServiceResponse, APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';
import { UtilityService } from 'src/app/utility-method.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-recharge-simple-new',
  templateUrl: './recharge-simple-new.page.html',
  styleUrls: ['./recharge-simple-new.page.scss'],
})
export class RechargeSimpleNewPage implements OnInit, AfterViewChecked {

  pageTitle: string = '';
  

  newRechargeForm: UntypedFormGroup;
  typeList: any = [];
  rechageDetail: Array<string> = [];

  CategoryId: number = 0;
  DefaultPriceIncTax: string = '';
  rechargeTypeId: string = '';
  paymentReference: string = '';
  SurchargePrice: string = '';
  totalAmount: string = '';

  DefaultPriceIncTaxStr: string = '';
  SurchargePriceStr: string = '';
  totalAmountStr: string = '';

  paymentMethodList: any = [];
  payCtrl = new UntypedFormControl('', Validators.required);

  endingIn: string = '';
  confirmModal: boolean = false;

  enableCancel: boolean = true;
  paymentFail: boolean = false;
  sureStr = '';
  yesStr = '';
  noStr = '';
  payStr = '';
  okStr = '';

  private ServiceReference = 0;

  private paymentMethodIndex = 0;
  buyState: boolean = false;

  switchPayment: boolean = false;
  ContactCode: string = '';
  selectedIndex: number = 0;

  constructor(
    private navCtrl: NavController,
    private toast: ToastService,
    private loading: LoadingService,
    private tranService: TranService,
    private rNewService: RechargeSimpleNewService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private utilityService: UtilityService,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    @Inject(APP_CONFIG) public config: IAppConfig,
    public globService: GlobalService,
    @Inject(Token_config) public tokens: TokenInterface,
  ) {
    
    this.tranService.translaterService();

    this.newRechargeForm = this.formBuilder.group({
      type: ['', Validators.required],
      payCtrl: this.payCtrl
    });
    this.ContactCode = this.tokens.UserCode;
    this.setInitialPageTitle();

    this.CategoryId = this.route.snapshot.params['CategoryId'];

    this.tranService.convertText('are_you_sure').subscribe(value => {
      this.sureStr = value;
    });

    this.tranService.convertText('ending_in').subscribe(value => {
      this.endingIn = value;
    });

    this.tranService.convertText('y_m_r_a_payment_method').subscribe(value => {
      this.payStr = value;
    });

    this.tranService.convertText('yes').subscribe(value => {
      this.yesStr = value;
    });

    this.tranService.convertText('no').subscribe(value => {
      this.noStr = value;
    });

    this.tranService.convertText('ok').subscribe(value => {
      this.okStr = value;
    });


    this.rNewService.DefaultService().subscribe((result: DefaultServiceResponse) => {
      
      if (result === null) {
        this.tranService.errorMessage('no_default_service');
        this.ServiceReference = 0;
      } else {
        this.ServiceReference = result.ServiceReference;
      }
    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    }, () => {

    })

    window.onload = function () {
      document.getElementById('creditConfirmModal').addEventListener('keyup', function (e: any) {
      });
    };

    this.setPayCtrl();

  }

  setInitialPageTitle() {
    if (this.CategoryId.toString() === '1') {
      this.tranService.convertText('new_online_voucher').subscribe(value => {
        this.pageTitle = value;
      });
    } else if (this.CategoryId.toString() === '2') {
      this.tranService.convertText('new_offline_voucher').subscribe(value => {
        this.pageTitle = value;
      });
    }
  }

  ngAfterViewChecked() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  rechargeItem(index) {
    this.DefaultPriceIncTax = this.typeList[index].DefaultPriceIncTax;
    this.DefaultPriceIncTaxStr = this.globService.getCurrencyConfiguration(this.DefaultPriceIncTax);
    this.rechargeTypeId = this.typeList[index].TypeId;
    this.selectedIndex = index;
    this.getPaymentListWithCtrl();
  }

  async paymentItem(index) {
    this.paymentMethodIndex = index;
    this.paymentReference = this.paymentMethodList[index].data.id;
    await this.loading.present();
    const reqPram = {
      'PaymentRequestAmount': this.DefaultPriceIncTax,
      'PaymentMethodCode': this.paymentMethodList[index].data.PaymentMethodCode,
      'ProviderId': this.paymentReference
    }
    this.SurchargePrice = '';
    this.SurchargePriceStr = this.globService.getCurrencyConfiguration(this.SurchargePrice);
    this.totalAmount = '';
    this.totalAmountStr = this.globService.getCurrencyConfiguration(this.totalAmount);
    this.rNewService.CalculateSurcharge(reqPram).subscribe(async (result: any) => {
      await this.loading.dismiss();
      
      if (result === null) {
      } else {
        this.SurchargePrice = result.toString();
        this.SurchargePriceStr = this.globService.getCurrencyConfiguration(this.SurchargePrice);
        this.calTotalAmount();
        this.checkBuyState();
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  calTotalAmount() {
    this.totalAmount = (parseFloat(this.DefaultPriceIncTax) +
      parseFloat(this.SurchargePrice)).toString();
    this.totalAmountStr = this.globService.getCurrencyConfiguration(this.totalAmount);
  }

  async ngOnInit() {

    await this.loading.present();
    this.rNewService.getAvailList(this.CategoryId).subscribe(async (result: RechargeSimpleNewItem[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_recharges');
      } else {
        for (const list of result) {
          this.typeList.push(list);
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  newRecharge() {
    this.showAlert();
    // this.addNewRecharge();
  }

  async showAlert() {
    const alert = await this.alertCtrl.create({
      subHeader: this.sureStr,
      buttons: [
        {
          text: this.noStr,
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: this.yesStr,
          handler: () => {
            
            this.addNewRecharge();
          }
        }
      ]
    });
    await alert.present();
  }

  async addNewRecharge() {
    let param;
    param = {
      'ServiceReference': this.ServiceReference,
      'RechargeTypeId': this.rechargeTypeId,
      'PaymentMethodReference': this.paymentReference,
      'PaymentRequestAmount': this.DefaultPriceIncTax,
    };

    this.confirmModal = true;
    document.getElementById('creditConfirmModal').style.display = 'flex';

    this.enableCancel = true;
    this.paymentFail = false;
    this.focusText();
    setTimeout(() => {
      this.focusText();
    }, 1000);

    this.rNewService.addNewRechargeNew(param).subscribe((result: RechargeAddNew) => {
      
      if (result === null) {
      } else {
      }

      if (result.PayRequestStatus.Id === 3) {

        this.enableCancel = false;

        setTimeout(() => {
          if (document.getElementById('creditConfirmModal') !== null) {
            document.getElementById('creditConfirmModal').style.display = 'none';
          }
          this.navCtrl.navigateRoot(['Recharges/recharge-simple-list', this.CategoryId, { replaceUrl: true }]);
        }, 10000);


      } else {
        this.paymentFail = true;
        this.tranService.specialErrorMessage('creditError', result.LastError);
        if (document.getElementById('creditConfirmModal') !== null) {
          document.getElementById('creditConfirmModal').style.display = 'none';
        }
        // this.navCtrl.navigateRoot(['Recharges/recharge-simple-list', this.CategoryId, { replaceUrl: true }]);
      }
    }, (error: any) => {

      if (document.getElementById('creditConfirmModal') !== null) {
        document.getElementById('creditConfirmModal').style.display = 'none';
      }

      this.tranService.errorMessage(error);
    });
  }

  async getPaymentListWithCtrl() {
    if (this.paymentMethodList.length > 0) {
      if (this.newRechargeForm.get('payCtrl').valid) {
        this.paymentItem(this.paymentMethodIndex);
        this.setPayCtrl();
      }
    } else {
      let param;
      param = {
        'type': this.newRechargeForm.controls['type'].value,
        'CategoryId': this.CategoryId,
      };
      await this.loading.present();
      this.rNewService.addNewRecharge(param).subscribe(async (result: CustomerPaymentMethodListItem[]) => {
        
        await this.loading.dismiss();
        if (result === null || result.length === 0) {
          this.showPaymentAlert();
        } else {
          this.paymentMethodList = new Array();
          for (const list of result) {
            const temp = {
              'data': list,
              'method': list.Description + ' ' + this.endingIn + ' ' + this.getCardEndNumber(list.AccountNumber)
            };
            this.paymentMethodList.push(temp);
          }
          this.setPayCtrl();
        }
      }, async (error: any) => {
        await this.loading.dismiss();
        
        this.tranService.errorMessage(error);
      });
    }
  }

  async showPaymentAlert() {
    const alert = await this.alertCtrl.create({
      subHeader: this.payStr,
      buttons: [
        {
          text: this.okStr,
          handler: () => {
            // this.navCtrl.navigateForward(['Payment/customer-payment-method-list-uc-bus']);
            this.switchPayment = true;
            this.tranService.convertText('payment_method').subscribe(value => {
              this.pageTitle = value;
            });
          }
        }
      ]
    });
    await alert.present();
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  getCardEndNumber(number) {
    const removedStr = number.replace(/ /g, '');
    return removedStr.substr(removedStr.length - 4);
  }

  closeConfirmModal() {
    this.confirmModal = false;
    document.getElementById('creditConfirmModal').style.display = 'none';
    // this.navCtrl.navigateRoot(['Recharges/recharge-simple-list', this.CategoryId, { replaceUrl: true }]);
  }

  closeModal(en: any) {
    if (en.key === 'Backspace' && !this.enableCancel) {
      document.getElementById('creditConfirmModal').style.display = 'none';
      this.navCtrl.navigateRoot(['Recharges/recharge-simple-list', this.CategoryId, { replaceUrl: true }]);
    }
  }

  focusText() {
    document.getElementById('creditConfirmModalSubmit').focus();
  }

  setPayCtrl() {
    if (this.paymentMethodList.length === 0) {
      this.newRechargeForm.get('payCtrl').disable();
      this.buyState = false;
    } else {
      this.newRechargeForm.get('payCtrl').enable();
      this.checkBuyState();
    }
  }

  checkBuyState() {
    if (this.newRechargeForm.valid) {
      this.buyState = true;
    } else {
      this.buyState = false;
    }
  }

  processPayment(event) {
    if (event === 'close') {
      this.switchPayment = false;
      this.rechargeItem(this.selectedIndex);
      this.setInitialPageTitle();
    } else if (event === 'emptyMethod') {
      this.navCtrl.pop();
    }
  }

}
