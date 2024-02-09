import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BarServiceService } from './services/bar-service.service';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { ActivatedRoute } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl } from '@angular/forms';
import { ConfigureResourceService } from 'src/services/configure-resource.service';
import { ConfigurationItem } from 'src/app/model';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-bar-service',
  templateUrl: './bar-service.page.html',
  styleUrls: ['./bar-service.page.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class BarServicePage implements OnInit {

  pageTitle: string = '';

  
  debitRunId: string = '';

  noteData: string = '';

  barForm: UntypedFormGroup;

  barTypeList = [
    {
      text: 'administration_bar',
      value: ''
    }
  ];

  barReasonList = [
    {
      text: 'credit_alent',
      value: ''
    },
    {
      text: 'customer_request',
      value: ''
    },
    {
      text: 'LostStolenPhone',
      value: ''
    }
  ];

  all: boolean = false;
  children: boolean = false;
  sameServiceType: boolean = false;
  sibiling: boolean = false;
  cNEvent: boolean = false;
  unBarState: boolean = false;

  configState = false;

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private barService: BarServiceService,
    
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private resourceConf: ConfigureResourceService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('bar_service').subscribe(value => {
      this.pageTitle = value;
    });
    
    this.debitRunId = this.router.snapshot.params['Id'];
    this.tranService.convertText('service').subscribe(value => {
      this.debitRunId = '[' + value + ': ' + this.debitRunId + ']';
    });
    this.barForm = this.formBuilder.group({
      BarType: ['', Validators.required],
      BarReason: ['', Validators.required],
      DateToBarService: ['', Validators.required],
      DateFromBarService: [''],
      note: ['']
    });

    for (const list of this.barTypeList) {
      this.tranService.convertText(list.text).subscribe(value => {
        list.value = value;
      });
    }

    for (const list of this.barReasonList) {
      this.tranService.convertText(list.text).subscribe(value => {
        list.value = value;
      });
    }
    this.resourceConf.getConfResource('BAR_SHOW_BULK_OPTIONS').subscribe((result: ConfigurationItem[]) => {
      
      if (result === null) {
        this.configState = true;
      } else {
        if (result[0].Key === 'BAR_SHOW_BULK_OPTIONS' && result[0].Value === 'NO') {
          this.configState = false;
        } else {
          this.configState = true;
        }
      }
    }, (error: any) => {
      
      this.tranService.errorMessage(error);
    }, () => {
    });
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  ngOnInit() {
    this.unBarStateChange();
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  goBack() {
    this.navCtrl.pop();
  }

  SubmitTerminate() {

  }

  unBarStateChange() {

    if (this.unBarState) {
      this.barForm.get('DateFromBarService').enable();
    } else {
      this.barForm.get('DateFromBarService').disable();
    }
  }

}
