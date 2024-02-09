import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { LoadingService, TranService, ToastService } from 'src/services';

import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { GlobalService } from 'src/services/global-service.service';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';

@Component({
  selector: 'app-contact-new-component',
  templateUrl: './contact-new-component.page.html',
  styleUrls: ['./contact-new-component.page.scss'],
})
export class ContactNewComponentPage implements OnInit {

  @Input() ContactCode: string = '';
  @Output('ContactNewComponent') ContactNewComponent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('ContactNewIdGrid') ContactNewIdGrid: jqxGridComponent;

  contactNewForm: UntypedFormGroup;

  genderList = [
    {
      'text': 'male',
      'value': ''
    },
    {
      'text': 'female',
      'value': ''
    }
  ];

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

  typeList = [
    {
      'text': 'individual',
      'value': '',
    },
    {
      'text': 'corporation',
      'value': '',
    }
  ];

  questionList = [
    { text: 'question 1', value: 'question1' },
    { text: 'question 2', value: 'question2' },
    { text: 'question 3', value: 'question3' },
    { text: 'question 4', value: 'question4' },
  ]

  contactType: boolean = true;
  

  selectIndex: number;
  selectedData: any;
  gridWidth: any;
  gridContentWidth = '';

  source = {
    localdata: [],
    datafields: [
      { name: 'description', type: 'string', map: '0' },
      { name: 'value', type: 'string', map: '1' },
      { name: 'expiry_date', type: 'string', map: '2' },
    ],
    datatype: 'array'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  columns = [
    { text: '', datafield: 'description', width: 90, editable: false },
    { text: '', datafield: 'value', width: 90, editable: false },
    { text: '', datafield: 'expiry_date', width: 90, editable: false },
  ];

  groupList = [];

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    private alertCtrl: AlertController,
    private toast: ToastService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.contactNewForm = this.formBuilder.group({
      contactCode: ['', Validators.required],
      type: ['', Validators.required],
      sigfoxGrpId: ['', Validators.required],
      firstName: ['', Validators.required],
      title: ['', Validators.required],
      initials: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      DOB: ['', Validators.required],

      name: ['', Validators.required],
      ACN: ['', Validators.required],
      ABN: ['', Validators.required],

      email: ['', [
        Validators.required,
        Validators.email
      ]],
      question: ['', Validators.required],
      answer: ['', Validators.required],
    });

    
    this.setFormDynamic();

    this.setTranslateText();
    this.setGridWidth();
  }

  ngOnInit() {
    this.contactNewForm.get('contactCode').setValue(this.ContactCode);
    for (let list of this.columns) {
      this.tranService.convertText(list.datafield).subscribe(result => {
        list.text = result;
      })
    }
  }

  setTranslateText() {
    for (let list of this.genderList) {
      this.tranService.convertText(list.text).subscribe(result => {
        list.value = result;
      });
    }

    for (let list of this.typeList) {
      this.tranService.convertText(list.text).subscribe(result => {
        list.value = result;
      });
    }
  }

  submitContactNew() {
    if (this.contactNewForm.valid) {
    }
  }

  get f() {
    return this.contactNewForm.controls;
  }

  changeType(index) {
    if (this.typeList[index].text === 'individual') {
      this.contactType = true;
    } else {
      this.contactType = false;
    }
    this.setFormDynamic();
  }

  submitTrigger() {
    document.getElementById('contact-new-submit').click();
  }

  goBack() {
    this.ContactNewComponent.emit('close');
  }

  setFormDynamic() {
    if (this.contactType) {
      this.contactNewForm.removeControl('name');
      this.contactNewForm.removeControl('ACN');
      this.contactNewForm.removeControl('ABN');

      // if(this.contactNewForm)
      this.contactNewForm.addControl('firstName', new UntypedFormControl('', Validators.required));
      this.contactNewForm.addControl('title', new UntypedFormControl('', Validators.required));
      this.contactNewForm.addControl('initials', new UntypedFormControl('', Validators.required));
      this.contactNewForm.addControl('lastName', new UntypedFormControl('', Validators.required));
      this.contactNewForm.addControl('gender', new UntypedFormControl('', Validators.required));
      this.contactNewForm.addControl('DOB', new UntypedFormControl('', Validators.required));
    } else {
      this.contactNewForm.addControl('name', new UntypedFormControl('', Validators.required));
      this.contactNewForm.addControl('ACN', new UntypedFormControl('', Validators.required));
      this.contactNewForm.addControl('ABN', new UntypedFormControl('', Validators.required));

      this.contactNewForm.removeControl('firstName');
      this.contactNewForm.removeControl('title');
      this.contactNewForm.removeControl('initials');
      this.contactNewForm.removeControl('lastName');
      this.contactNewForm.removeControl('gender');
      this.contactNewForm.removeControl('DOB');
    }
  }

  getWidth() {
    let element = document.getElementById('contact-new-component');
    if (typeof (element) !== 'undefined' && element !== null) {
      return element.offsetWidth;
    } else {
      return 900;
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
      return 'calc(100% - 2px)';
    }
  }

  getGridWidth() {
    this.gridWidth = 0;
    for (let i = 0; i < this.columns.length; i++) {
      this.gridWidth = this.gridWidth + this.columns[i].width;
    }
  }

  exportData() {
    this.ContactNewIdGrid.exportview('xlsx', 'Contact New Id list');
  }

  setGridData() {
    for (const list of this.groupList) {
      let tempData = [];
      tempData = [
        list.description, list.value, list.expiryDate
      ];
      this.source.localdata.push(tempData);
    }

    this.ContactNewIdGrid.updatebounddata();
    this.source.localdata.length = 0;
  }

}
