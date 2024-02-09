import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { rejects } from 'assert';
import { debounceTime } from 'rxjs/operators';
import { Token_config, TokenInterface } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { TillService } from './services/till.service'

declare var PaymentJs: any;
@Component({
  selector: 'app-till',
  templateUrl: './till.component.html',
  styleUrls: ['./till.component.scss'],
})

export class TillComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output() tillCardIsClosed=new EventEmitter<{closed: boolean }>();
  payCode: string = '';
  makeDefault: boolean = false;
  tillCardForm!: UntypedFormGroup;
 
  creditCardRequired:any;
  invalidCreditCard:any;
  cvvRequired:any;
  invalidCvv:any;
  cardPlaceholder:any ='';
  cvvPlaceholder:any='';
  validCreditCard:any=false;
  validCvv:any=false;
  cardLabel:any=false;
  cvvLabel:any=false;
  cardFocused:any=true;
  cvvFocused:any=true;
  
  payment: any;
  token: any;
  cardData: any;
  focusStyle = {
    'outline': 'none',
    'border-bottom': '2px solid #3f51b5',
    '-webkit-transition': 'width .5s ease, background-color .5s ease',
    '-o-transition': 'width .5s ease, background-color .5s ease',   
    'transition': 'width .5s ease, background-color .5s ease',
    'animation': 'cdk-text-field-autofill-end 0s 1ms'   
  };

  errorStyle = {
    'outline': 'none',
    'border-bottom': '2px solid #F44336',
    '-webkit-transition': 'width .5s ease, background-color .5s ease',
    '-o-transition': 'width .5s ease, background-color .5s ease',   
    'transition': 'width .5s ease, background-color .5s ease',
    'animation': 'cdk-text-field-autofill-end 0s 1ms',
    '::placeholder':'{color:red}'
  }; 

  hoverStyle = {
    'outline': 'none',
    'border-width': '0 0 10px 0',
    'border-style': 'solid',
    'border-color': '#3f51b5',
    '-webkit-transition': 'translateY(-1.28125em) scale(0.75) perspective(100px) translateZ(0.001px)',
    '-o-transition': 'translateY(-1.28125em) scale(0.75) perspective(100px) translateZ(0.001px)',     
    'transform': 'translateY(-1.28125em) scale(0.75) perspective(100px) translateZ(0.001px)',
    'animation': 'cdk-text-field-autofill-end 0s 1ms'
  };

  inputStyle = {
    'font': 'inherit',
    'color': '#000',
    'outline': '0 !important',
    'padding': '0',
    'margin': '0',
    'width': '99%',
    'max-width': '99%',
    'height':'100%',
    'vertical-align': 'bottom',
    'text-align': 'inherit',
    'font-size': '14px',
    'font-weight': '400',
    'line-height': '1.125',
    'font-family': 'Roboto, "Helvetica Neue", sans-serif',
    'letter-spacing': 'normal',
    'margin-top': '-0.0625em',
    'border-width': '0 0 0.05px 0',
    'border-style': 'solid',
    'border-color': '#949494'   
  };

  cPK: string = 'YMFY08m2EKVYYnYq4tRB' //move it to global store or get it from api
  months: any = [{ value: '01', name: 'Jan' }, { value: '02', name: 'Feb' }, { value: '03', name: 'Mar' }, { value: '04', name: 'Apr' }, { value: '05', name: 'May' }, { value: '06', name: 'Jun' },
  { value: '07', name: 'Jul' }, { value: '08', name: 'Aug' }, { value: '09', name: 'Sep' }, { value: '10', name: 'Oct' }, { value: '11', name: 'Nov' }, { value: '12', name: 'Dec' }];
  years: any = [];
  constructor(private loading: LoadingService,
    private tranService: TranService,
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private tillService: TillService,
    public globService: GlobalService,
    @Inject(Token_config)
    private tokens: TokenInterface,
    private modalCtrl: ModalController,) {}  


  ngOnInit(): void {
    this.creditCardRequired=false;
    this.invalidCreditCard=false;
    this.cvvRequired=false;
    this.invalidCvv=false;    
    this.cardFocused=false;
    this.cvvFocused=false;
    this.years = this.getYearList();
    this.createForm();   
    // remove the value setting once testing is over
   this.tillCardForm.get('cardHolderName')?.setValue('Selcomm Tester');
   this.tillCardForm.get('email')?.setValue('tester@selcomm.com.au');    
   
    this.tranService.convertText('credit_card_num').subscribe(result => {
      this.cardPlaceholder = result;
    });

    this.tranService.convertText('cvv').subscribe(result => {
    this.cvvPlaceholder = result;
    }); 
    
    this.initPaymentJs();
  }

  initPaymentJs(){
    this.payment = new PaymentJs();   
    this.loading.present();
    this.payment.init(this.cPK, 'number_div', 'cvv_div', function (payment: any, err: any) {     
      this.payment = payment;        
      this.cvvOnFocus(this.payment);
      this.cardNumberOnFocus(this.payment)
      this.cvvFocusOut(this.payment);
      this.cardNumberFocusOut(this.payment);   
      this.cardNumberOnInput(this.payment);
      this.CvvOnInput(this.payment);
      this.loading.dismiss();  
      this.payment.setNumberStyle(this.inputStyle);
      this.payment.setCvvStyle(this.inputStyle);     
      this.payment.setNumberPlaceholder(this.cardPlaceholder);
      this.payment.setCvvPlaceholder(this.cvvPlaceholder);    
      this.payment.focusNumber(); 
      console.log("inti payment error : " + err);
    }.bind(this));
  }
  createForm() {
    this.tillCardForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      cardHolderName: new UntypedFormControl('', [Validators.required]),
      expiryMonth: new UntypedFormControl('', [Validators.required]),
      expiryYear: new UntypedFormControl('', [Validators.required]),
    });
  }
  cvvFocusOut(payment:any){    
    payment.cvvOn('blur', function () {     
      payment.setCvvStyle(this.inputStyle);
      payment.validate(function(resp:any){        
        if(resp.cvvLength==0){
          this.cvvRequired=true;     
          this.invalidCvv=false; 
          this.validCvv=false; 
          this.payment.setCvvStyle(this.errorStyle);
          //this.payment.focusCvv(); 
         }
         else{
           if(resp.validCvv!=null && resp.validCvv==true){
            this.cvvRequired=false;     
            this.invalidCvv=false;  
            this.validCvv=true; 
            this.payment.setCvvStyle(this.inputStyle);
           }
           else{            
            this.cvvRequired=false;     
            this.invalidCvv=true; 
            this.validCvv=false; 
            this.payment.setCvvStyle(this.errorStyle);
             //this.payment.focusCvv();             
           }      
         } 
         this.cvvFocused=false; 
      }.bind(this));    
    }.bind(this));
    this.cvvLabel=false;
  }

  cardNumberFocusOut(payment:any){     
    payment.numberOn('blur', function () {    
    payment.setNumberStyle(this.inputStyle);
    payment.validate(function(resp:any){          
        if(resp.numberLength==0){
         this.creditCardRequired=true;     
         this.invalidCreditCard=false; 
         this.validCreditCard=false;
         this.payment.setNumberStyle(this.errorStyle);         
         //this.payment.focusNumber(); 
        }
        else{
          if(resp.validNumber!=null && resp.validNumber==true){
            this.creditCardRequired=false;
            this.invalidCreditCard=false;
            this.validCreditCard=true;
            this.payment.setNumberStyle(this.inputStyle);   
            this.payment.focusCvv(); 
           
          }
          else{            
            this.invalidCreditCard=true;
            this.payment.setNumberStyle(this.errorStyle);   
            this.creditCardRequired=false;
            this.validCreditCard=false;

            //this.payment.focusNumber();             
          }      
        }
        this.setCardType(resp.cardType); 
        this.cardFocused=false;  
    }.bind(this));

    }.bind(this));
    this.cardLabel=false;
  }

  cvvOnFocus(payment:any){  
    payment.cvvOn('focus', function () {   
      if(!this.cvvRequired && !this.invalidCvv)
      {
        payment.setCvvStyle(this.focusStyle);
        if(!this.invalidCvv && !this.cvvRequired)
        {
        this.cvvFocused=true;
        }
      }    
      
    }.bind(this));
  }

  cardNumberOnFocus(payment:any){     
    payment.numberOn('focus', function () {    
      if(!this.creditCardRequired && !this.invalidCreditCard)
      {        
        payment.setNumberStyle(this.focusStyle);
        if(!this.invalidCreditCard && !this.creditCardRequired)
        {
        this.cardFocused=true;
        console.log(this.cardFocused);
        console.log(this.validCreditCard);
        }
      }    
    }.bind(this));
  }

  cardNumberOnInput(payment){    
    payment.numberOn('input', function (data) {    
      this.cardLabel=true;    
     if(data.numberLength>0){     
      this.creditCardRequired=false;
      if(data.validNumber){
        this.invalidCreditCard=false;
        payment.setNumberStyle(this.input);
      }
      else{
        this.invalidCreditCard=true;
        payment.setNumberStyle(this.errorStyle);
      }
     }
     else{
      this.cardLabel=false;  
      this.creditCardRequired=true; 
      payment.setNumberStyle(this.errorStyle);
      this.invalidCreditCard=false;
     }
    }.bind(this));
  }

  CvvOnInput(payment){   
    payment.cvvOn('input', function (data) { 
      this.cvvLabel=true; 
     if(data.cvvLength>0){     
      this.cvvRequired=false;
      if(data.validCvv){
        this.invalidCvv=false;
        payment.setCvvStyle(this.input);
      }
      else{
        this.invalidCvv=true;
        payment.setCvvStyle(this.errorStyle);
      }
     }
     else{
      this.cvvLabel=false;
      this.cvvRequired=true;
      payment.setCvvStyle(this.errorStyle);
      this.invalidCvv=false;    
      payment.setCvvPlaceholder(this.cvvPlaceholder);
     }
    }.bind(this));
  }

  getYearList() {
    var currentYear = new Date().getFullYear();
    var endYear = currentYear + 10;
    var years = [];
    while (currentYear <= endYear) {
      years.push(currentYear++);
    }
    return years;
  }
  submitForm() {   
    this.tokenizeCard().then(function (tokenResponse: any) {
      this.token = tokenResponse.token;
      this.cardData = tokenResponse.cardData;     
      this.addPaymentMethod();  
    }.bind(this));
  }
  tokenizeCard() {
    this.loading.present();
    return new Promise(resolve => {
      if (this.tillCardForm.valid) {
        const reqBody = {
          email: this.tillCardForm.get('email')?.value,
          card_holder: this.tillCardForm.get('cardHolderName')?.value,
          month: this.tillCardForm.get('expiryMonth')?.value,
          year: this.tillCardForm.get('expiryYear')?.value
        }      
        this.payment.tokenize(reqBody, function (token: any, cardData: any) {
          var tokenResponse = {
            token: token,
            cardData: cardData
          };     
          this.loading.dismiss();     
          return resolve(tokenResponse);
        }.bind(this),function(errors) {
          this.tranService.errorMessage(errors);
        }.bind(this),
          function (errors: any) {
            this.loading.dismiss();
            console.log(errors);           
          }.bind(this)
        );
      }
    });
  }
  get f() {
    return this.tillCardForm.controls;
  }
  onClose() {
     this.tillCardIsClosed.emit({ closed: true });
  }

  async addPaymentMethod() {  
     let expDate = new Date();
     expDate.setMonth(this.cardData.month);
     expDate.setFullYear(this.cardData.year);
     this.setCardType(this.cardData.card_type);

    const reqParam = {
      'PayCode': this.payCode,
      'AccountNumber': this.cardData.first_six_digits.toString()+ 'xxxxxx' + this.cardData.last_four_digits.toString(),
      'AccountName': this.cardData.full_name,
      'ExpiryDate': expDate,
      'CVV': '',     
      'CustomerOwned': true,
      'Token': this.token,
      'Exported': true,
      'ProtectNumber': true,
      'Tokenise': false,
      'Default': this.makeDefault,
      'AllowExisting': false,
      'CheckConfiguration': true,
      'FirstName': '',
      'CompanyName': '',
      'AddressLine1': '',
      'AddressLine2': '',
      'City': '',
      'State': '',
      'Country': '',
      'PhoneNumber': '',
      ContactCode: this.ContactCode,
    }  

    await this.loading.present();
    this.tillService.addPaymentMethod(this.ContactCode,reqParam).subscribe(async (result: any) => {      
      await this.loading.dismiss();      
      this.makeDefault = false;  
      this.tranService.errorToastMessage('payment_method_added');
      this.tillCardForm.reset();
      this.tillCardForm.clearValidators(); 
      
      this.tillCardForm.get('email').setErrors(null);
      this.tillCardForm.get('cardHolderName').setErrors(null);
      this.tillCardForm.get('expiryMonth').setErrors(null);
      this.tillCardForm.get('expiryYear').setErrors(null);
      this.initPaymentJs();
    }, async (error: any) => {
      await this.loading.dismiss();      
      this.tranService.errorMessage(error);
    });
  }

  setCardType(type:any){
    switch(type){
      case 'visa' : this.payCode='VI';break;
      case 'amex' : this.payCode='AM';break;
      case 'mastercard' : this.payCode='MC';break;
      case 'diners' : this.payCode='DC';break;
      default:break;
    }
  }
}
