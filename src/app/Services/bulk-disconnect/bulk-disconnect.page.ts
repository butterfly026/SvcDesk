import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BulkDisconnectService } from './services/bulk-disconnect.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';

import { ActivatedRoute } from '@angular/router';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-bulk-disconnect',
  templateUrl: './bulk-disconnect.page.html',
  styleUrls: ['./bulk-disconnect.page.scss'],
})
export class BulkDisconnectPage implements OnInit {


  pageTitle: string = '';

  
  debitRunId: string = '';
  terminateForm: UntypedFormGroup;

  terminateType: string = 'now';
  reasonList = [
    {
      'text': 'bad_debt',
      'value': ''
    },
    {
      'text': 'bankrupt',
      'value': ''
    },
    {
      'text': 'credit_alert',
      'value': ''
    },
    {
      'text': 'customer_request',
      'value': ''
    },
    {
      'text': 'deceased',
      'value': ''
    },
    {
      'text': 'fraud',
      'value': ''
    },
    {
      'text': 'loss',
      'value': ''
    },
    {
      'text': 'LostStolenPhone',
      'value': ''
    }
  ];

  cNEvent: boolean = false;
  cAOEvents: boolean = false;
  cBFCharges: boolean = false;
  bFCImmediately: boolean = false;
  uFUsage: boolean = false;
  payoutType: string = 'currentPayment';
  calPrice: string = '0';
  all: boolean = false;
  children: boolean = false;
  sameServiceType: boolean = false;
  sibiling: boolean = false;

  bulkState: boolean = false;


  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private bulkDisService: BulkDisconnectService,
    
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    private fomBuilder: UntypedFormBuilder,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    this.tranService.convertText('bulk_disconnect').subscribe(value => {
      this.pageTitle = value;
    });
    
    this.debitRunId = this.router.snapshot.params['Id'];
    this.terminateForm = this.fomBuilder.group({
      termDate: ['', Validators.required],
      note: [''],
      termReason: ['', Validators.required],
    });

    for (const list of this.reasonList) {
      this.tranService.convertText(list.text).subscribe(value => {
        list.value = value;
      });
    }

  }

  ngOnInit() {
    this.calPrice = this.globService.getCurrencyConfiguration(this.calPrice);
  }

  scrollContent(event) {
    this.globService.resetTimeCounter();
  }

  SubmitTerminate() {
    if (this.terminateForm.valid) {
      this.bulkState = true;
    }
  }

  selectReason(index) {

  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  goBack() {
    this.navCtrl.pop();
  }

  cancelBulk(event) {
    
    this.bulkState = false;
  }

}
