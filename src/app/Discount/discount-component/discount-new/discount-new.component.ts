import { Component, EventEmitter, OnInit, Output, Inject } from '@angular/core';
import { UntypedFormBuilder, Validators, FormGroup } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { DiscountNewService } from './services/discount-new-service';
import { DiscountInstance } from '../discount-list/discount-list.component.type';
import { AutoApPlay, BulkApply, DiscountDefinition, SkipExistCheck } from './discount-new.component.type';
import { DiscountListService } from '../discount-list/services/discount-list-service';
import { SpinnerService } from 'src/app/Shared/services';
import { AlertService } from 'src/services/alert-service.service';
import { Paging } from 'src/app/model';

@Component({
  selector: 'app-discount-new',
  templateUrl: './discount-new.component.html',
  styleUrls: ['./discount-new.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: navigator.language },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class DiscountNewComponent implements OnInit {
  @Output('DiscountNewComponent') DiscountNewComponent: EventEmitter<string> = new EventEmitter<string>();

  showSpinnerForDefinition: boolean = false;
  showSpinnerForDiscount: boolean = false;
  discountDefinitions: DiscountDefinition[];
  discounts: DiscountInstance[];
  autoApplyOptions: AutoApPlay[] = ['Yes', 'No'];
  bulkApplyOptions: BulkApply[] = ['Account', 'Child', 'Group', 'Sibling', 'Type', 'No'];
  skipExistCheckOptions: SkipExistCheck[] = ['Yes', 'Add', 'No'];
  eventParamForDefinition = new Paging();
  eventParamForDiscount = new Paging();
  discountForm: FormGroup;

  private selectedDiscountDefinition: DiscountDefinition;
  private selectedDiscount: DiscountInstance;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private discountNewService: DiscountNewService,
    private discountService: DiscountListService,
    private spinnerService: SpinnerService,
    private alertService: AlertService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private dialogRef: MatDialogRef<DiscountNewComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { ServiceReferenceId: number }
  ) {
    this.tranService.translaterService();
  }

  ngOnInit() {
    this.discountForm = this.formBuilder.group({
      DiscountDefinition: ['', Validators.required],
      ParentServiceDiscountInstance: ['', Validators.required],
      AutoApply: [true, Validators.required],
      BulkApply: ['', Validators.required],
      From: ['', Validators.required],
      To: ['', Validators.required],
      ChildAccounts: [true, Validators.required],
      SkipChecks: [true, Validators.required],
      SkipExistCheck: ['', Validators.required],
      AdjustDates: [true, Validators.required]
    });

    this.discountForm.get('ParentServiceDiscountInstance').valueChanges
      .pipe(
        debounceTime(500),
        takeUntil(this.unsubscribeAll$),
        filter(s => !!s)
      )
      .subscribe((result: any) => {
        this.eventParamForDiscount.SearchString = result;
        if (result.length > 2) {         
          this.getDiscountList();
        }
      });

      this.discountForm.get('DiscountDefinition').valueChanges
      .pipe(
        debounceTime(500),
        takeUntil(this.unsubscribeAll$),
        filter(s => !!s)
      )
      .subscribe((result: any) => {
        this.eventParamForDefinition.SearchString = result;
        if (result.length > 2) {         
          this.getDiscountDefinitions();
        }
      });
  }

  ngOnDestroy(): void {
    this.alertService.closeAllAlerts();
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  goBack(): void {
    this.dialogRef.close();
  }

  clearDefinitionSearchString(): void {
    this.eventParamForDefinition.SearchString = '';
    this.discountForm.get('DiscountDefinition').patchValue('');
    this.getDiscountDefinitions();
  }
  
  clearDiscountSearchString(): void {
    this.eventParamForDiscount.SearchString = '';
    this.discountForm.get('ParentServiceDiscountInstance').patchValue('');
    this.getDiscountList();
  }

  selectDisountDefinition(val: DiscountDefinition): void {
    this.selectedDiscountDefinition = val;
  }

  selectParentDiscount(val: DiscountInstance): void {
    this.selectedDiscount = val;
  }

  submitTrigger(): void {
    document.getElementById('submitButton').click();
  }

  eventSubmit(): void {
    this.spinnerService.loading();

    this.discountNewService.addNewDiscount(this.data.ServiceReferenceId, {
      ...this.discountForm.value,
      ParentServiceDiscountInstanceId: this.selectedDiscount?.Id,
      DiscountDefinitionId: this.selectedDiscountDefinition.Id,
      AutoApply: this.discountForm.value.AutoApPlay ? 'Yes' : 'No'
    })
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: () => this.spinnerService.end(),
        error: (err) => {
          this.spinnerService.end();
          this.tranService.errorMessage(err);
        }
      })
  }

  private async getDiscountList(): Promise<void> {
    this.showSpinnerForDiscount = true;
    this.discountService.getDiscountList(this.data.ServiceReferenceId, this.eventParamForDiscount)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result =>{
          this.showSpinnerForDiscount = false;
          if (result === null) {
            this.tranService.errorMessage('no_discounts');
          } else {
            this.discounts = result.Items;
          }
        },
        error: error=> {
          this.showSpinnerForDiscount = false;
          this.tranService.errorMessage(error);
        }
      })
  }

  private async getDiscountDefinitions(): Promise<void> {
    this.showSpinnerForDefinition = true;
    this.discountNewService.getDiscountDefinitionList(this.data.ServiceReferenceId, this.eventParamForDefinition)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result =>{
          this.showSpinnerForDefinition = false;
          if (result === null) {
            this.tranService.errorMessage('no_definitions');
          } else {
            this.discountDefinitions = result.Items;
          }
        },
        error: error=> {
          this.showSpinnerForDefinition = false;
          this.tranService.errorMessage(error);
        }
      })
  }

}
