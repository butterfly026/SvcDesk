import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ConfigurationItem } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { ConfigureResourceService } from 'src/services/configure-resource.service';
import { GlobalService } from 'src/services/global-service.service';

import { UnBarService } from './services/unbar-service';

@Component({
  selector: 'app-unbar',
  templateUrl: './unbar.component.html',
  styleUrls: ['./unbar.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class UnbarComponent implements OnInit {

  @Input() barId: string = '';
  @Output('UnbarComponent') UnbarComponent: EventEmitter<string> = new EventEmitter<string>();

  

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
    private unBarService: UnBarService,
    
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private resourceConf: ConfigureResourceService,
    public globService: GlobalService
  ) {
    this.tranService.translaterService();
    
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
    // this.resourceConf.getConfResource('UNBAR_SHOW_BULK_OPTIONS').subscribe((result: ConfigurationItem[]) => {
    //   
    //   if (result === null) {
    //     this.configState = true;
    //   } else {
    //     if (result[0].Key === 'UNBAR_SHOW_BULK_OPTIONS' && result[0].Value === 'NO') {
    //       this.configState = false;
    //     } else {
    //       this.configState = true;
    //     }
    //   }
    // }, (error: any) => {
    //   
    //   this.tranService.errorMessage(error);
    // }, () => {
    // });
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
    this.UnbarComponent.emit('close');
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
