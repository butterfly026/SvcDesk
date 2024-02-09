import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewChecked, Inject } from '@angular/core';
import { CustomerNewService } from './services/customer-new.service';
import { NavController, AlertController } from '@ionic/angular';
import { LoadingService, TranService, ToastService } from 'src/services';

import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { jqxCheckBoxComponent } from 'jqwidgets-ng/jqxcheckbox';
import { CustomerContactPhoneItem, ContactPhoneTypeItem, CustomerNewInfo, CustomerEmailItem, ContactQuestionsTypeItem, CustomerAddressTypeItem, ContactEmailUsage, APP_CONFIG, IAppConfig, TokenInterface, Token_config, } from 'src/app/model';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { jqxComboBoxComponent } from 'jqwidgets-ng/jqxcombobox';
import { ContactEmailsService } from '../contacts-emails/contact-emails-component/services/contact-email.service';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-customer-new',
  templateUrl: './customer-new.page.html',
  styleUrls: ['./customer-new.page.scss'],
})
export class CustomerNewPage implements OnInit, AfterViewChecked {

  @ViewChild('myGridCustomerNew') myGridCustomerNew: jqxGridComponent;

  @ViewChild('defaultMethod') defaultMethod: jqxCheckBoxComponent;
  @ViewChild('futureStart') futureStart: jqxCheckBoxComponent;
  @ViewChild('proPaymentMethod') proPaymentMethod: jqxCheckBoxComponent;
  @ViewChild('markExport') markExport: jqxCheckBoxComponent;

  @ViewChild('provideEmillBill') provideEmillBill: jqxCheckBoxComponent;
  @ViewChild('providePaperBill') providePaperBill: jqxCheckBoxComponent;
  @ViewChild('provideSMSBill') provideSMSBill: jqxCheckBoxComponent;
  @ViewChild('provideExcelBill') provideExcelBill: jqxCheckBoxComponent;

  @ViewChild('myComboBoxCustomerNew') myComboBoxCustomerNew: jqxComboBoxComponent;

  pageTitle: string = '';
  

  CustomerNewForm: UntypedFormGroup;

  SubTypeList = [
    {
      'Text': 'individual',
      'Value': '',
    },
    {
      'Text': 'corporation',
      'Value': '',
    }
  ];
  SubTitleList = [
    {
      'Text': 'mr',
      'Value': '',
    },
    {
      'Text': 'ms',
      'Value': '',
    },
    {
      'Text': 'mrs',
      'Value': '',
    }
  ]
  genderList = [
    {
      'Text': 'male',
      'Value': ''
    },
    {
      'Text': 'female',
      'Value': ''
    }
  ];
  businessList = [
    {
      'Text': 'TCI',
      'Value': 'TCI',
    },
    {
      'Text': 'TCI 1',
      'Value': 'TCI 1',
    },
    {
      'Text': 'TCI 2',
      'Value': 'TCI 2',
    }
  ];
  PeymentTypeList = [
    {
      'Text': 'credit_card',
      'Value': 'TCI',
    },
    {
      'Text': 'direct_debit',
      'Value': 'TCI 1',
    },
    {
      'Text': 'remittance',
      'Value': 'TCI 2',
    }
  ];
  FormatList = [
    {
      'Text': 'detailed_invoice_format',
      'Value': '',
    }
  ];
  CycleList = [
    {
      'Text': 'calendar_month',
      'Value': '',
    }
  ];
  DebitCycleList = [
    {
      'Text': 'calendar_month',
      'Value': '',
    }
  ];
  CurrencyList = [
    {
      'Text': 'australian_dollar',
      'Value': '',
    }
  ];
  TaxList = [
    {
      'Text': 'australian_gst',
      'Value': '',
    }
  ];

  ContactCodeList = [
    {
      'Text': 'contact_code',
      'Value': 'Contact Code'
    }
  ];
  ContactPriorityList = [
    {
      'Text': 'Contact Priority',
      'Value': 'Contact Priority'
    }
  ];
  DealerList = [
    {
      'Text': 'Dear',
      'Value': 'Dear'
    }
  ];
  SalesPersonList = [
    {
      'Text': 'Sales Person',
      'Value': 'Sales Person'
    }
  ];
  ContactCategoryList = [
    {
      'Text': 'Contact Category',
      'Value': 'Contact Category'
    }
  ];
  ContactIndustryList = [
    {
      'Text': 'Contact Industry',
      'Value': 'Contact Industry'
    }
  ];
  ContactClassList = [
    {
      'Text': 'Contact Class',
      'Value': 'Contact Class'
    }
  ];
  ContactMediaList = [
    {
      'Text': 'Contact Media',
      'Value': 'Contact Media'
    }
  ];
  ReportPlanList = [
    {
      'Text': 'Report Plan',
      'Value': 'Report Plan'
    }
  ];
  DataSummaryList = [
    {
      'Text': 'Data Summary',
      'Value': 'Data Summary'
    }
  ];
  BlockLogonList = [
    {
      'Text': 'Block Logon',
      'Value': 'Block Logon'
    }
  ];
  GLAccountList = [
    {
      'Text': 'GL Account',
      'Value': 'GL Account'
    }
  ];
  CreditLimitList = [
    {
      'Text': 'Credit Limit',
      'Value': 'Credit Limit'
    }
  ];
  PaymentTermsList = [
    {
      'Text': 'Payment Terms',
      'Value': 'Payment Terms'
    }
  ];
  CreditStatusList = [
    {
      'Text': 'Credit Status',
      'Value': 'Credit Status'
    }
  ];
  RelationShipList = [
    {
      'Text': 'director',
      'Value': ''
    },
    {
      'Text': 'father',
      'Value': ''
    },
    {
      'Text': 'mother',
      'Value': ''
    },
    {
      'Text': 'account',
      'Value': ''
    },
    {
      'Text': 'technical',
      'Value': ''
    }
  ]


  public expireMonth = [];
  public expireYear = [];

  currentPhoneList = [];
  phoneTypeList: Array<ContactPhoneTypeItem> = [];
  private arrayLenth: number = 0;

  currentEmailList = [];
  private arrayLenthEmail: number = 0;
  emailTypeList = [
    { 'Text': 'account' },
    { 'Text': 'technical' }
  ];

  currentQueList = [];
  queTypeList: Array<ContactQuestionsTypeItem> = [];
  private arrayLenthQue: number = 0;
  private calledQue = false;

  currentAddressList = [];
  addressTypeList = [];
  private arrayLenthAddress: number = 0;
  countryList = [];

  currentAssContactList = [];
  private arrayLenthAssContact: number = 0;


  InfoList = [];
  treeData = [];

  treeViewContentHeight = '';

  selectedId = '';
  logonCode: string = '';
  infoPassword: string = '';

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  source = {
    localdata: [],
    datafields: [
      { name: 'logon_code', type: 'string', map: '0' },
      { name: 'password', type: 'string', map: '1' },
      { name: 'has_logged_on', type: 'string', map: '2' }
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'logon_code', width: 120 },
    { text: '', datafield: 'password', width: 120 },
    { text: '', datafield: 'has_logged_on', width: 120 }
  ];

  enableDeleteItem: boolean = false;
  ContactInfoList: Array<CustomerNewInfo> = [];


  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private cNService: CustomerNewService,
    private cEService: ContactEmailsService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private alertCtrl: AlertController,
    private toast: ToastService,
    @Inject(APP_CONFIG) public config: IAppConfig,
    public globService: GlobalService,
    @Inject(Token_config) public tokens: TokenInterface,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('customer_new').subscribe(value => {
      this.pageTitle = value;
    });
    

    this.CustomerNewForm = this.formBuilder.group({
      ContactCode: ['', Validators.required],
      SubType: ['', Validators.required],
      SubKey: ['', Validators.required],
      SubFirstName: ['', Validators.required],
      SubTitle: ['', Validators.required],
      SubInitial: ['', Validators.required],
      SubLastName: ['', Validators.required],
      SubTradingName: ['', Validators.required],
      SubGender: ['', Validators.required],
      SubDoB: ['', Validators.required],
      SubSalutation: ['', Validators.required],
      SubEmNo: ['', Validators.required],
      SubQuestion: [''],
      SubAnswer: [''],
      SubUnit: ['', Validators.required],
      SubName: ['', Validators.required],
      SubACN: ['', Validators.required],
      SubABN: ['', Validators.required],
      BillPaymentType: ['', Validators.required],
      BillCCNum: ['', [Validators.required, Validators.pattern('[0-9]{16,16}')]],
      BillCHName: ['', Validators.required],
      BillExpireMonth: ['', Validators.required],
      BillExpireYear: ['', Validators.required],
      BillDirectName: ['', Validators.required],
      BillDirectAccount: ['', Validators.required],
      BillDirectBSB: ['', Validators.required],
      BillFitureDate: ['', Validators.required],
      BillExtId: ['', Validators.required],
      BillFormat: ['', Validators.required],
      BillCycle: ['', Validators.required],
      BillDebitCycle: ['', Validators.required],
      BillCurrency: ['', Validators.required],
      BillTax: ['', Validators.required],
      ContactCodeInfo: [''],
      ContactPriority: [''],
      Dealer: [''],
      SalesPerson: [''],
      ContactCategory: [''],
      ContactIndustry: [''],
      ContactClass: [''],
      ContactMedia: [''],
      ReportPlan: [''],
      DataSummary: [''],
      BlockLogon: [''],
      GLAccount: [''],
      CreditLimit: [''],
      PaymentTerms: [''],
      CreditStatus: [''],
    });

    this.CustomerNewForm.controls.SubType.setValue('individual');
    this.SubTypeClick();
    this.setTranslate();

    for (let i = 1; i < 13; i++) {
      this.expireMonth.push(i);
    }

    for (let i = new Date().getFullYear(); i < 2050; i++) {
      this.expireYear.push(i);
    }

    this.setGridWidth();

    for (let i = 0; i < this.columns.length; i++) {
      this.tranService.convertText(this.columns[i].datafield).subscribe(value => {
        this.columns[i].text = value;
      });
    }

    this.getPhoneTypeList();
    this.getPhoneList();
    this.getEmailList();
    this.getQueList();
    this.getQueTypeList();
    this.getInfoList();
    this.getAddressTypeList();
    this.getAddressList();
    this.getCountryList();
    this.getAssContactList();
  }

  ngOnInit() {
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  ngAfterViewChecked() {
  }

  overTable(index) {
    const element = document.getElementById('customeTableBody' + index);
    const elementDetail = element.getElementsByClassName('custom-table-body-td');
    for (let i = 0; i < elementDetail.length; i++) {
      elementDetail[i].classList
        .add('jqx-fill-state-hover', 'jqx-fill-state-hover-' + this.globService.themeColor);
    }
  }

  leaveTable(index) {
    const element = document.getElementById('customeTableBody' + index);
    const elementDetail = element.getElementsByClassName('custom-table-body-td');
    for (let i = 0; i < elementDetail.length; i++) {
      elementDetail[i].classList
        .remove('jqx-fill-state-hover', 'jqx-fill-state-hover-' + this.globService.themeColor);
    }
  }

  overTableDetail(indexI, indexJ) {
    const element = document.getElementById('customeTableBody' + indexI + indexJ);
    const elementDetail = element.getElementsByClassName('custom-table-body-td');
    for (let i = 0; i < elementDetail.length; i++) {
      elementDetail[i].classList
        .add('jqx-fill-state-hover', 'jqx-fill-state-hover-' + this.globService.themeColor);
    }
  }

  leaveTableDetail(indexI, indexJ) {
    const element = document.getElementById('customeTableBody' + indexI + indexJ);
    const elementDetail = element.getElementsByClassName('custom-table-body-td');
    for (let i = 0; i < elementDetail.length; i++) {
      elementDetail[i].classList
        .remove('jqx-fill-state-hover', 'jqx-fill-state-hover-' + this.globService.themeColor);
    }
  }

  setTranslate() {
    for (const list of this.genderList) {
      this.tranService.convertText(list.Text).subscribe(value => {
        list.Value = value;
      });
    }

    for (const list of this.SubTypeList) {
      this.tranService.convertText(list.Text).subscribe(value => {
        list.Value = value;
      });
    }

    for (const list of this.SubTitleList) {
      this.tranService.convertText(list.Text).subscribe(value => {
        list.Value = value;
      });
    }

    for (const list of this.PeymentTypeList) {
      this.tranService.convertText(list.Text).subscribe(value => {
        list.Value = value;
      });
    }

    for (const list of this.FormatList) {
      this.tranService.convertText(list.Text).subscribe(value => {
        list.Value = value;
      });
    }

    for (const list of this.CycleList) {
      this.tranService.convertText(list.Text).subscribe(value => {
        list.Value = value;
      });
    }

    for (const list of this.DebitCycleList) {
      this.tranService.convertText(list.Text).subscribe(value => {
        list.Value = value;
      });
    }

    for (const list of this.CurrencyList) {
      this.tranService.convertText(list.Text).subscribe(value => {
        list.Value = value;
      });
    }

    for (const list of this.TaxList) {
      this.tranService.convertText(list.Text).subscribe(value => {
        list.Value = value;
      });
    }

    for (const list of this.RelationShipList) {
      this.tranService.convertText(list.Text).subscribe(value => {
        list.Value = value;
      });
    }

  }

  get f() {
    return this.CustomerNewForm.controls;
  }

  SubTypeClick() {
    const subtypeValue = this.CustomerNewForm.controls.SubType.value;
    if (subtypeValue === 'corporation') {
      if (this.CustomerNewForm.controls.SubUnit !== null
        && typeof (this.CustomerNewForm.controls.SubUnit) !== 'undefined') {
        this.CustomerNewForm.removeControl('SubFirstName');
        this.CustomerNewForm.removeControl('SubTitle');
        this.CustomerNewForm.removeControl('SubInitial');
        this.CustomerNewForm.removeControl('SubLastName');
        this.CustomerNewForm.removeControl('SubSalutation');
        this.CustomerNewForm.removeControl('SubEmNo');
        this.CustomerNewForm.removeControl('SubGender');
        this.CustomerNewForm.removeControl('SubDoB');
      }
      if (this.CustomerNewForm.controls.SubUnit === null
        || typeof (this.CustomerNewForm.controls.SubUnit) === 'undefined') {
        this.CustomerNewForm.addControl('SubUnit', new UntypedFormControl('', Validators.required));
        this.CustomerNewForm.addControl('SubName', new UntypedFormControl('', Validators.required));
        this.CustomerNewForm.addControl('SubACN', new UntypedFormControl('', Validators.required));
        this.CustomerNewForm.addControl('SubABN', new UntypedFormControl('', Validators.required));
      }
    } else {
      if (this.CustomerNewForm.controls.SubUnit !== null
        && typeof (this.CustomerNewForm.controls.SubUnit) !== 'undefined') {
        this.CustomerNewForm.removeControl('SubUnit');
        this.CustomerNewForm.removeControl('SubName');
        this.CustomerNewForm.removeControl('SubACN');
        this.CustomerNewForm.removeControl('SubABN');
      }
      if (this.CustomerNewForm.controls.SubFirstName === null
        || typeof (this.CustomerNewForm.controls.SubFirstName) === 'undefined') {
        this.CustomerNewForm.addControl('SubFirstName', new UntypedFormControl('', Validators.required));
        this.CustomerNewForm.addControl('SubTitle', new UntypedFormControl('', Validators.required));
        this.CustomerNewForm.addControl('SubInitial', new UntypedFormControl('', Validators.required));
        this.CustomerNewForm.addControl('SubLastName', new UntypedFormControl('', Validators.required));
        this.CustomerNewForm.addControl('SubSalutation', new UntypedFormControl('', Validators.required));
        this.CustomerNewForm.addControl('SubEmNo', new UntypedFormControl('', Validators.required));
        this.CustomerNewForm.addControl('SubGender', new UntypedFormControl('', Validators.required));
        this.CustomerNewForm.addControl('SubDoB', new UntypedFormControl('', Validators.required));
      }
    }
  }

  PaymentTypeClick() {
    const Type = this.f.BillPaymentType.value;
    if (Type === 'credit_card') {

      this.CustomerNewForm.removeControl('BillDirectName');
      this.CustomerNewForm.removeControl('BillDirectAccount');
      this.CustomerNewForm.removeControl('BillDirectBSB');

      this.CustomerNewForm.addControl('BillCCNum', new UntypedFormControl('', [Validators.required, Validators.pattern('[0-9]{16,16}')]));
      this.CustomerNewForm.addControl('BillCHName', new UntypedFormControl('', Validators.required));
      this.CustomerNewForm.addControl('BillExpireMonth', new UntypedFormControl('', Validators.required));
      this.CustomerNewForm.addControl('BillExpireYear', new UntypedFormControl('', Validators.required));
    } else if (Type === 'direct_debit') {

      this.CustomerNewForm.removeControl('BillCCNum');
      this.CustomerNewForm.removeControl('BillCHName');
      this.CustomerNewForm.removeControl('BillExpireMonth');
      this.CustomerNewForm.removeControl('BillExpireYear');

      this.CustomerNewForm.addControl('BillDirectName', new UntypedFormControl('', Validators.required));
      this.CustomerNewForm.addControl('BillDirectAccount', new UntypedFormControl('', Validators.required));
      this.CustomerNewForm.addControl('BillDirectBSB', new UntypedFormControl('', Validators.required));
    } else {

      this.CustomerNewForm.removeControl('BillCCNum');
      this.CustomerNewForm.removeControl('BillCHName');
      this.CustomerNewForm.removeControl('BillExpireMonth');
      this.CustomerNewForm.removeControl('BillExpireYear');

      this.CustomerNewForm.removeControl('BillDirectName');
      this.CustomerNewForm.removeControl('BillDirectAccount');
      this.CustomerNewForm.removeControl('BillDirectBSB');
    }
  }

  submitTrigger() {

  }

  goBack() {
    // tslint:disable-next-line:forin
    for (const key in this.CustomerNewForm.controls) {
    }
    // this.navCtrl.pop();
  }

  submitCustomer() {

  }

  selectExpireYear() {
    if (parseInt(this.CustomerNewForm.controls.BillExpireYear.value, 10) === new Date().getFullYear()) {

      if (parseInt(this.CustomerNewForm.controls.BillExpireMonth.value, 10) < new Date().getMonth() + 1) {
        this.CustomerNewForm.controls.BillExpireMonth.setValue('');
        this.CustomerNewForm.controls.BillExpireMonth.setErrors({ 'invalid': true });
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

  onChangeFuture() {
  }

  // Phone Type part
  async getPhoneList() {
    this.currentPhoneList = [];
    await this.loading.present();
    this.cNService.getPhoneList().subscribe(async (result: CustomerContactPhoneItem[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_phones');
      } else {
        for (let i = 0; i < result.length; i++) {
          result[i].TypeCtrl = 'customerPhoneType' + i;
          result[i].PhoneCtrl = 'customerPhoneValue' + i;
          this.currentPhoneList.push(result[i]);
          this.CustomerNewForm.addControl(result[i].TypeCtrl, new UntypedFormControl('', Validators.required));
          this.CustomerNewForm.addControl(result[i].PhoneCtrl, new UntypedFormControl('', [Validators.required, Validators.pattern('[0-9]{5,}')]));
        }
        for (let i = 0; i < this.currentPhoneList.length; i++) {
          this.CustomerNewForm.controls[this.currentPhoneList[i].PhoneCtrl].setValue(this.currentPhoneList[i].PhoneNumber);
          this.CustomerNewForm.controls[this.currentPhoneList[i].TypeCtrl].setValue(this.currentPhoneList[i].Text);
        }
        this.arrayLenth = this.currentPhoneList.length;
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  async getPhoneTypeList() {
    this.phoneTypeList = [];
    await this.loading.present();
    this.cNService.getPhoneTypeList().subscribe((result: ContactPhoneTypeItem[]) => {
      
      if (result === null) {
        this.tranService.errorMessage('no_phone_types');
      } else {
        for (const list of result) {
          this.phoneTypeList.push(list);
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  addNewPhone() {
    const newPhone = {
      Text: '',
      Value: '',
      PhoneNumber: '',
      TypeCtrl: 'customerPhoneType' + this.arrayLenth,
      PhoneCtrl: 'customerPhoneValue' + this.arrayLenth,
    }
    this.CustomerNewForm.addControl(newPhone.TypeCtrl, new UntypedFormControl('', Validators.required));
    this.CustomerNewForm.addControl(newPhone.PhoneCtrl, new UntypedFormControl('', [Validators.required, Validators.pattern('[0-9]{5,}')]));
    this.CustomerNewForm.controls[newPhone.PhoneCtrl].reset();
    this.CustomerNewForm.controls[newPhone.TypeCtrl].reset();
    this.currentPhoneList.push(newPhone);
    this.arrayLenth = this.arrayLenth + 1;
    this.setFocusType(newPhone.TypeCtrl);
  }

  setFocusType(idName) {
    if (document.getElementById(idName) === null || typeof (document.getElementById(idName)) === 'undefined') {
      setTimeout(() => {
        this.setFocusType(idName);
      }, 500);
    } else {
      document.getElementById(idName).click();
    }
  }

  deletePhone(index) {
    const phoneType = this.currentPhoneList[index].TypeCtrl;
    const phoneValue = this.currentPhoneList[index].PhoneCtrl;
    this.CustomerNewForm.removeControl(phoneValue);
    this.CustomerNewForm.removeControl(phoneType);
    this.currentPhoneList.splice(index, 1);
  }

  // Emails part
  async getEmailList() {
    this.currentEmailList = [];
    await this.loading.present();
    this.cEService.getEmailList(this.tokens.UserCode).subscribe(async (result: ContactEmailUsage) => {
      
      await this.loading.dismiss();
      let convResult = this.globService.ConvertKeysToLowerCase(result);
      if (result === null) {
        this.tranService.errorMessage('no_emails');
      } else {
        for (let i = 0; i < convResult.contactemailusages.length; i++) {
          let temp = {
            Code: '',
            Text: '',
            PhoneNumber: '',
            TypeCtrl: '',
            ValueCtrl: '',
          };
          temp.Text = convResult.contactemailusages[i].emailtypes[0].name;
          temp.Code = convResult.contactemailusages[i].emailtypes[0].code;
          temp.PhoneNumber = convResult.contactemailusages[i].emailaddress;
          temp.TypeCtrl = 'customerEmailType' + i;
          temp.ValueCtrl = 'customerEmailValue' + i;

          this.currentEmailList.push(temp);
          this.CustomerNewForm.addControl(temp.TypeCtrl, new UntypedFormControl('', Validators.required));
          this.CustomerNewForm.addControl(temp.ValueCtrl, new UntypedFormControl('', [Validators.required, Validators.email]));
        }
        for (let i = 0; i < this.currentEmailList.length; i++) {
          this.CustomerNewForm.controls[this.currentEmailList[i].ValueCtrl].setValue(this.currentEmailList[i].Value);
          this.CustomerNewForm.controls[this.currentEmailList[i].TypeCtrl].setValue(this.currentEmailList[i].Text);
        }
        this.arrayLenthEmail = this.currentEmailList.length;
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  addNewEmail() {
    const newEmail = {
      Text: '',
      Value: '',
      Type: '',
      TypeCtrl: 'customerEmailType' + this.arrayLenthEmail,
      ValueCtrl: 'customerEmailValue' + this.arrayLenthEmail,
    }
    this.CustomerNewForm.addControl(newEmail.TypeCtrl, new UntypedFormControl('', Validators.required));
    this.CustomerNewForm.addControl(newEmail.ValueCtrl, new UntypedFormControl('', [Validators.required, Validators.email]));
    this.CustomerNewForm.controls[newEmail.ValueCtrl].reset();
    this.CustomerNewForm.controls[newEmail.TypeCtrl].reset();
    this.currentEmailList.push(newEmail);
    this.arrayLenthEmail = this.arrayLenthEmail + 1;
    this.setFocusTypeEmail(newEmail.TypeCtrl);
  }

  setFocusTypeEmail(idName) {
    if (document.getElementById(idName) === null || typeof (document.getElementById(idName)) === 'undefined') {
      setTimeout(() => {
        this.setFocusType(idName);
      }, 500);
    } else {
      document.getElementById(idName).click();
    }
  }

  deleteEmail(index) {
    const emailType = this.currentEmailList[index].TypeCtrl;
    const emailValue = this.currentEmailList[index].ValueCtrl;
    this.CustomerNewForm.removeControl(emailValue);
    this.CustomerNewForm.removeControl(emailType);
    this.currentEmailList.splice(index, 1);
  }

  // Security Question part
  async getQueList() {
    this.currentQueList = [];
    await this.loading.present();
    this.cNService.getQueList().subscribe(async (result: ContactQuestionsTypeItem[]) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_contacts_question_type');
      } else {
        for (let i = 0; i < result.length; i++) {
          result[i].TypeCtrl = 'customerQueType' + i;
          result[i].QueCtrl = 'customerQueValue' + i;
          this.currentQueList.push(result[i]);
          this.CustomerNewForm.addControl(result[i].TypeCtrl, new UntypedFormControl('', Validators.required));
          this.CustomerNewForm.addControl(result[i].QueCtrl, new UntypedFormControl('', Validators.required));
        }
        for (let i = 0; i < this.currentQueList.length; i++) {
          this.CustomerNewForm.controls[this.currentQueList[i].QueCtrl].setValue(this.currentQueList[i].Value);
          this.CustomerNewForm.controls[this.currentQueList[i].TypeCtrl].setValue(this.currentQueList[i].Text);
        }
        this.arrayLenthQue = this.currentQueList.length;
        this.checkState();
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  async getQueTypeList() {
    this.queTypeList = [];
    this.calledQue = false;
    await this.loading.present();
    this.cNService.getQueTypeList().subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.calledQue = true;
      if (result === null) {
        this.tranService.errorMessage('no_contacts_question');
      } else {
        for (const list of result) {
          this.queTypeList.push(list);
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  addNewQuestion() {
    if (this.currentQueList.length < this.queTypeList.length) {
      const newEmail = {
        Text: '',
        Value: '',
        Type: '',
        TypeCtrl: 'customerQueType' + this.arrayLenthQue,
        QueCtrl: 'customerQueValue' + this.arrayLenthQue,
      }
      this.CustomerNewForm.addControl(newEmail.TypeCtrl, new UntypedFormControl('', Validators.required));
      this.CustomerNewForm.addControl(newEmail.QueCtrl, new UntypedFormControl('', Validators.required));
      this.CustomerNewForm.controls[newEmail.QueCtrl].reset();
      this.CustomerNewForm.controls[newEmail.TypeCtrl].reset();
      this.currentQueList.push(newEmail);
      this.arrayLenthQue = this.arrayLenthQue + 1;
      this.setFocusTypeQue(newEmail.TypeCtrl);
    } else {
      this.toast.present('You can\'t add more');
    }
  }

  setFocusTypeQue(idName) {
    if (document.getElementById(idName) === null || typeof (document.getElementById(idName)) === 'undefined') {
      setTimeout(() => {
        this.setFocusType(idName);
      }, 500);
    } else {
      document.getElementById(idName).click();
    }
  }

  deleteAnswer(index) {
    const emailType = this.currentQueList[index].TypeCtrl;
    const emailValue = this.currentQueList[index].QueCtrl;
    this.CustomerNewForm.removeControl(emailValue);
    this.CustomerNewForm.removeControl(emailType);
    this.currentQueList.splice(index, 1);
  }

  checkState() {
    if (this.calledQue) {
      for (const list of this.currentQueList) {
        for (const queList of this.queTypeList) {
          if (list.Text === queList.Text) {
            queList.Status = true;
          }
        }
      }
    } else {
      setTimeout(() => {
        this.checkState();
      }, 500);
    }
  }

  // Address part
  async getAddressList() {
    this.currentAddressList = [];
    await this.loading.present();

    this.cNService.getAddressList().subscribe(async (result: any) => {
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_addresses');
      } else {
        for (let i = 0; i < result.length; i++) {
          const addressValue = {
            TypeCtrl: 'customerAddressType' + i,
            Address1Ctrl: 'customerAddress1' + i,
            Address2Ctrl: 'customerAddress2' + i,
            PostCodeCtrl: 'customerPostCode' + i,
            SuburbCtrl: 'customerSuburbCtrl' + i,
            StateCtrl: 'customerStateCtrl' + i,
            CityCtrl: 'customerCityCtrl' + i,
            CountryCtrl: 'customerCountryCtrl' + i,
            postState: true,
            Suburb: result[i].SuburbList,
          }
          this.currentAddressList.push(addressValue);
          this.CustomerNewForm.addControl(addressValue.TypeCtrl, new UntypedFormControl('', Validators.required));
          this.CustomerNewForm.addControl(addressValue.Address1Ctrl, new UntypedFormControl('', Validators.required));
          this.CustomerNewForm.addControl(addressValue.Address2Ctrl, new UntypedFormControl('', Validators.required));
          this.CustomerNewForm.addControl(addressValue.PostCodeCtrl, new UntypedFormControl('', [Validators.required, Validators.pattern('[0-9]{6,6}')]));
          this.CustomerNewForm.addControl(addressValue.SuburbCtrl, new UntypedFormControl('', Validators.required));
          this.CustomerNewForm.addControl(addressValue.StateCtrl, new UntypedFormControl('', Validators.required));
          this.CustomerNewForm.addControl(addressValue.CountryCtrl, new UntypedFormControl('', Validators.required));
          this.CustomerNewForm.addControl(addressValue.CityCtrl, new UntypedFormControl('', Validators.required));
        }
        for (let i = 0; i < this.currentAddressList.length; i++) {
          this.CustomerNewForm.controls[this.currentAddressList[i].TypeCtrl].setValue(result[i].TypeValue);
          this.CustomerNewForm.controls[this.currentAddressList[i].Address1Ctrl].setValue(result[i].Address1);
          this.CustomerNewForm.controls[this.currentAddressList[i].Address2Ctrl].setValue(result[i].Address2);
          this.CustomerNewForm.controls[this.currentAddressList[i].PostCodeCtrl].setValue(result[i].PostCode);
          this.CustomerNewForm.controls[this.currentAddressList[i].SuburbCtrl].setValue(result[i].Suburb);
          this.CustomerNewForm.controls[this.currentAddressList[i].StateCtrl].setValue(result[i].State);
          this.CustomerNewForm.controls[this.currentAddressList[i].CountryCtrl].setValue(result[i].Country);
          this.CustomerNewForm.controls[this.currentAddressList[i].CityCtrl].setValue(result[i].City);
        }
        this.arrayLenthAddress = this.currentAddressList.length;
        this.checkState();
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });

  }

  getCountryList() {
    this.cNService.getCountryList().subscribe((result: any) => {
      for (const list of result) {
        this.countryList.push(list);
      }
    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    });
  }

  checkPostCode(index) {
    const addressPostCode = this.currentAddressList[index].PostCodeCtrl;
    const postCode = this.CustomerNewForm.controls[addressPostCode];
    if (postCode.valid) {
      this.getSuburbState(index);
    }
  }

  async getSuburbState(index) {
    await this.loading.present();
    const addressPostCode = this.currentAddressList[index].PostCodeCtrl;
    const postCode = this.CustomerNewForm.controls[addressPostCode];
    this.cNService.getSuburbState(postCode.value).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.currentAddressList[index].Suburb = new Array();
      if (result === null) {
        this.tranService.errorMessage('no_suburb_state');
      } else {
        this.addSuburbState(index);
        for (const list of result.Suburb) {
          this.currentAddressList[index].Suburb.push(list);
        }
        // this.addressForm.controls[addressType + 'Suburb'].setValue(result.Suburb);
        this.CustomerNewForm.controls[this.currentAddressList[index].StateCtrl].setValue(result.State);
      }
    }, async (error: any) => {
      
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    })
  }

  addSuburbState(index) {
    const newAddress = {
      SuburbCtrl: 'customerSuburbCtrl' + this.arrayLenthAddress,
      StateCtrl: 'customerStateCtrl' + this.arrayLenthAddress,
    };
    this.currentAddressList[index].postState = true;
    this.CustomerNewForm.addControl(newAddress.SuburbCtrl,
      new UntypedFormControl('', Validators.required));
    this.CustomerNewForm.addControl(newAddress.StateCtrl,
      new UntypedFormControl('', Validators.required));
  }

  async getAddressTypeList() {
    this.addressTypeList = [];
    await this.loading.present();
    this.cNService.getAddressTypeList().subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.calledQue = true;
      if (result === null) {
        this.tranService.errorMessage('no_address_types');
      } else {
        for (const list of result) {
          this.addressTypeList.push(list.Value);
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  addNewAddress() {
    const newAddress = {
      TypeCtrl: 'customerAddressType' + this.arrayLenthAddress,
      Address1Ctrl: 'customerAddress1' + this.arrayLenthAddress,
      Address2Ctrl: 'customerAddress2' + this.arrayLenthAddress,
      PostCodeCtrl: 'customerPostCode' + this.arrayLenthAddress,
      SuburbCtrl: 'customerSuburbCtrl' + this.arrayLenthAddress,
      StateCtrl: 'customerStateCtrl' + this.arrayLenthAddress,
      CityCtrl: 'customerCityCtrl' + this.arrayLenthAddress,
      CountryCtrl: 'customerCountryCtrl' + this.arrayLenthAddress
    }
    this.CustomerNewForm.addControl(newAddress.TypeCtrl, new UntypedFormControl('', Validators.required));
    this.CustomerNewForm.addControl(newAddress.Address1Ctrl, new UntypedFormControl('', Validators.required));
    this.CustomerNewForm.addControl(newAddress.Address2Ctrl, new UntypedFormControl('', Validators.required));
    this.CustomerNewForm.addControl(newAddress.PostCodeCtrl, new UntypedFormControl('', [Validators.required, Validators.pattern('[0-9]{6,6}')]));
    this.CustomerNewForm.addControl(newAddress.SuburbCtrl, new UntypedFormControl('', Validators.required));
    this.CustomerNewForm.addControl(newAddress.StateCtrl, new UntypedFormControl('', Validators.required));
    this.CustomerNewForm.addControl(newAddress.CityCtrl, new UntypedFormControl('', Validators.required));
    this.CustomerNewForm.addControl(newAddress.CountryCtrl, new UntypedFormControl('', Validators.required));
    this.CustomerNewForm.controls[newAddress.Address1Ctrl].reset();
    this.CustomerNewForm.controls[newAddress.TypeCtrl].reset();
    this.CustomerNewForm.controls[newAddress.Address2Ctrl].reset();
    this.CustomerNewForm.controls[newAddress.PostCodeCtrl].reset();
    this.CustomerNewForm.controls[newAddress.SuburbCtrl].reset();
    this.CustomerNewForm.controls[newAddress.StateCtrl].reset();
    this.CustomerNewForm.controls[newAddress.CityCtrl].reset();
    this.CustomerNewForm.controls[newAddress.CountryCtrl].reset();
    this.currentAddressList.push(newAddress);
    this.arrayLenthAddress = this.arrayLenthAddress + 1;

  }

  deleteAddress(index) {
    const addressElement = this.currentAddressList[index].TypeCtrl;
    this.CustomerNewForm.removeControl(addressElement.TypeCtrl);
    this.CustomerNewForm.removeControl(addressElement.Address1Ctrl);
    this.CustomerNewForm.removeControl(addressElement.Address2Ctrl);
    this.CustomerNewForm.removeControl(addressElement.PostCodeCtrl);
    this.CustomerNewForm.removeControl(addressElement.SuburbCtrl);
    this.CustomerNewForm.removeControl(addressElement.StateCtrl);
    this.CustomerNewForm.removeControl(addressElement.CityCtrl);
    this.CustomerNewForm.removeControl(addressElement.CountryCtrl);
    this.currentAddressList.splice(index, 1);
  }

  // Associate Contact
  async getAssContactList() {
    this.currentAssContactList = [];
    await this.loading.present();
    this.cNService.getAssContactList().subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      if (result === null) {
        this.tranService.errorMessage('no_addresses');
      } else {
        for (let i = 0; i < result.length; i++) {
          const newAss = {
            Type: 'customerAssType' + i,
            Title: 'customerAssTitle' + i,
            FirstName: 'customerAssFirstName' + i,
            LastName: 'customerAssLastName' + i,
            Email: 'customerAssEmail' + i,
            ContactPhone: 'customerAssContactPhone' + i,
          }
          this.currentAssContactList.push(newAss);
          this.CustomerNewForm.addControl(newAss.Type, new UntypedFormControl('', Validators.required));
          this.CustomerNewForm.addControl(newAss.Title, new UntypedFormControl('', Validators.required));
          this.CustomerNewForm.addControl(newAss.FirstName, new UntypedFormControl('', Validators.required));
          this.CustomerNewForm.addControl(newAss.LastName, new UntypedFormControl('', Validators.required));
          this.CustomerNewForm.addControl(newAss.Email, new UntypedFormControl('', [Validators.required, Validators.email]));
          this.CustomerNewForm.addControl(newAss.ContactPhone, new UntypedFormControl('', [Validators.required, Validators.pattern('[0-9]{8,}')]));
        }
        for (let i = 0; i < this.currentAssContactList.length; i++) {
          this.CustomerNewForm.controls[this.currentAssContactList[i].Type].setValue(result[i].TypeValue);
          this.CustomerNewForm.controls[this.currentAssContactList[i].Title].setValue(result[i].Title);
          this.CustomerNewForm.controls[this.currentAssContactList[i].FirstName].setValue(result[i].FirstName);
          this.CustomerNewForm.controls[this.currentAssContactList[i].LastName].setValue(result[i].LastName);
          this.CustomerNewForm.controls[this.currentAssContactList[i].Email].setValue(result[i].Email);
          this.CustomerNewForm.controls[this.currentAssContactList[i].ContactPhone].setValue(result[i].ContactPhone);
        }
        this.arrayLenthAssContact = this.currentAssContactList.length;
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  addAssContact() {
    if (this.currentAssContactList.length < this.queTypeList.length) {
      const newAss = {
        Type: 'customerAssType' + this.arrayLenthAssContact,
        Title: 'customerAssTitle' + this.arrayLenthAssContact,
        FirstName: 'customerAssFirstName' + this.arrayLenthAssContact,
        LastName: 'customerAssLastName' + this.arrayLenthAssContact,
        Email: 'customerAssEmail' + this.arrayLenthAssContact,
        ContactPhone: 'customerAssContactPhone' + this.arrayLenthAssContact,
      }
      this.CustomerNewForm.addControl(newAss.Type, new UntypedFormControl('', Validators.required));
      this.CustomerNewForm.addControl(newAss.Title, new UntypedFormControl('', Validators.required));
      this.CustomerNewForm.addControl(newAss.FirstName, new UntypedFormControl('', Validators.required));
      this.CustomerNewForm.addControl(newAss.LastName, new UntypedFormControl('', Validators.required));
      this.CustomerNewForm.addControl(newAss.Email, new UntypedFormControl('', [Validators.required, Validators.email]));
      this.CustomerNewForm.addControl(newAss.ContactPhone, new UntypedFormControl('', [Validators.required, Validators.pattern('[0-9]{8,}')]));
      this.CustomerNewForm.controls[newAss.Type].reset();
      this.CustomerNewForm.controls[newAss.Title].reset();
      this.CustomerNewForm.controls[newAss.FirstName].reset();
      this.CustomerNewForm.controls[newAss.LastName].reset();
      this.CustomerNewForm.controls[newAss.Email].reset();
      this.CustomerNewForm.controls[newAss.ContactPhone].reset();
      this.currentAssContactList.push(newAss);
      this.arrayLenthAssContact = this.arrayLenthAssContact + 1;
      this.setFocusTypeAssContact(newAss.Type);
    } else {
      this.toast.present('You can\'t add more');
    }
  }

  setFocusTypeAssContact(idName) {
    if (document.getElementById(idName) === null || typeof (document.getElementById(idName)) === 'undefined') {
      setTimeout(() => {
        this.setFocusType(idName);
      }, 500);
    } else {
      document.getElementById(idName).click();
    }
  }

  deleteAssContact(index) {
    const assElement = this.currentAssContactList[index];
    this.CustomerNewForm.removeControl(assElement.Type);
    this.CustomerNewForm.removeControl(assElement.Title);
    this.CustomerNewForm.removeControl(assElement.FirstName);
    this.CustomerNewForm.removeControl(assElement.LastName);
    this.CustomerNewForm.removeControl(assElement.Email);
    this.CustomerNewForm.removeControl(assElement.ContactPhone);
    this.currentAssContactList.splice(index, 1);
  }






  async getInfoList() {
    this.InfoList = new Array();
    await this.loading.present();
    this.cNService.getCustomerInfo().subscribe(async (result: any) => {
      await this.loading.dismiss();
      for (const list of result) {
        this.InfoList.push(list);
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  changePageNumber() {

  }

  addNewInfo() {
    const temp: CustomerNewInfo = {
      LogonCode: this.logonCode,
      Password: this.infoPassword,
      HasLoggedOn: '',
    }
    this.ContactInfoList.push(temp);
    this.setGridData();
  }

  getWidth() {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }

  selectRow() {
    this.selectIndex = this.myGridCustomerNew.getselectedrowindex();
    this.selectedData = this.myGridCustomerNew.getrowdata(this.selectIndex);
    if (typeof (this.selectedData) === 'undefined') {
      this.enableDeleteItem = false;
    } else {
      this.enableDeleteItem = true;
    }
  }

  setGridWidth() {
    this.getGridWidth();
    if (this.getWidth() > this.gridWidth + 32) {
      const tempData = this.gridContentWidth;
      this.gridContentWidth = this.gridWidth + 'px';
      if (tempData !== '' && tempData !== this.gridContentWidth) {
        this.cdr.detectChanges();
        this.setGridData();
      }
      return this.gridWidth;
    } else {
      const tempData = this.gridContentWidth;
      this.gridContentWidth = '100%';
      if (tempData !== '' && tempData !== this.gridContentWidth) {
        this.cdr.detectChanges();
        this.setGridData();
      }
      return '100%';
    }
  }

  getGridWidth() {
    this.gridWidth = 0;
    for (let i = 0; i < this.columns.length; i++) {
      this.gridWidth = this.gridWidth + this.columns[i].width;
    }
  }

  exportData() {
    this.myGridCustomerNew.exportview('xlsx', 'Customer New');
  }

  setGridData() {

    for (const list of this.ContactInfoList) {
      const tempData = [
        list.LogonCode, list.Password, list.HasLoggedOn
      ];
      this.source.localdata.push(tempData);
    }

    this.myGridCustomerNew.updatebounddata();

    this.source.localdata.length = 0;
  }

  deleteItem() {
    let currentIndex;
    for (let i = 0; i < this.ContactInfoList.length; i++) {
      if (this.selectedData.logon_code === this.ContactInfoList[i].LogonCode) {
        currentIndex = i;
      }
    }
    this.ContactInfoList.splice(currentIndex, 1);
    this.setGridData();
  }

  addRandomInfo() {
    const temp: CustomerNewInfo = {
      LogonCode: 'Random Mode' + this.ContactInfoList.length,
      Password: 'Random Password',
      HasLoggedOn: '',
    }
    this.ContactInfoList.push(temp);
    this.setGridData();
  }

}
