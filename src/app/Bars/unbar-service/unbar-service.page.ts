import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';
import { UnBarServiceService } from './services/unbar-service.service';

import { ActivatedRoute } from '@angular/router';
import { ConfigureResourceService } from 'src/services/configure-resource.service';
import { ConfigurationItem } from 'src/app/model';


import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-unbar-service',
  templateUrl: './unbar-service.page.html',
  styleUrls: ['./unbar-service.page.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class UnbarServicePage implements OnInit {

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
    }
  ];

  all: boolean = false;
  children: boolean = false;
  sameServiceType: boolean = false;
  sibiling: boolean = false;
  cNEvent: boolean = false;
  unBarState: boolean = false;

  configState: boolean = false;

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private unBarService: UnBarServiceService,
    
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private resourceConf: ConfigureResourceService,
    public globService: GlobalService
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('unbar_service').subscribe(value => {
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
    this.resourceConf.getConfResource('UNBAR_SHOW_BULK_OPTIONS').subscribe((result: ConfigurationItem[]) => {
      
      if (result === null) {
        this.configState = true;
      } else {
        if (result[0].Key === 'UNBAR_SHOW_BULK_OPTIONS' && result[0].Value === 'NO') {
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

  ngOnInit() {
    this.unBarStateChange();
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
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
