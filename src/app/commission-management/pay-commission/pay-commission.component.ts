import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, ToastService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-pay-commission',
  templateUrl: './pay-commission.component.html',
  styleUrls: ['./pay-commission.component.scss'],
})
export class PayCommissionComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() CommissionDetail: any;

  @Output('PayCommissionComponent') PayCommissionComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  public transactionSelection: string = 'tagged_transaction';
  public dealerSelection: string = 'one_dealer';
  public amountTypeSelection: string = 'default';
  public payCommmissionForm: UntypedFormGroup;
  public panelValue: string = '';
  public daysCheck: boolean;

  public amountTypeSelectionField: boolean;
  public transactionField: boolean;
  public allDealerSectionFields: boolean = true;
  public themeColor: string = localStorage.currentTheme || 'base';


  constructor(private fb: UntypedFormBuilder,
    private tranService: TranService,
    private loading: LoadingService,
    public globService: GlobalService,
  ) {

    this.tranService.translaterService();

    this.payCommmissionForm = this.fb.group({
      dealer_id: ['', Validators.required],
      dealer_name: ['', Validators.required],
      payable_amount: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      days: ['', Validators.required],
      cheque_number: [''],
      comment: ['']
    });
  }


  ngOnInit(): void {
    this.payCommmissionForm.controls['payable_amount'].disable();
    this.payCommmissionForm.get('dealer_id').setValue(this.CommissionDetail?.dealer_id);
    this.payCommmissionForm.get('dealer_name').setValue(this.CommissionDetail?.dealer_name);
    this.payCommmissionForm.get('payable_amount').setValue(this.CommissionDetail?.payable_amount);
    // this.payCommmissionForm.get('days').setValue(this.CommissionDetail?.days);
    this.payCommmissionForm.get('cheque_number').setValue(this.CommissionDetail?.cheque_no);
    this.payCommmissionForm.get('comment').setValue(this.CommissionDetail?.comment);
  }


  _transactionSelection = (transaction_type: string): void => {

    this.transactionSelection = transaction_type;
  };


  _dealerSelection = (dealer_type: string): void => {

    this.dealerSelection = dealer_type;
    this.transactionField = !(this.amountTypeSelectionField = (dealer_type === 'all_dealer'));

    for (const control in this.payCommmissionForm.controls) {

      if (!['days', 'cheque_number', 'comment'].includes(control)) {
        dealer_type === 'all_dealer' ? this.payCommmissionForm.controls[control].disable()
          : this.payCommmissionForm.controls[control].enable();
      }
    }

    this.allDealerSectionFields = this.transactionField;
  };


  _amountTypeSelection = (amount_type: string): void => {

    this.amountTypeSelection = amount_type;

    amount_type === 'default' ? this.payCommmissionForm.controls['payable_amount'].disable()
      : this.payCommmissionForm.controls['payable_amount'].enable();
  };


  saveForm() {
    this.PayCommissionComponent.emit({ type: 'close', data: null });
  };

  closeForm() {
    this.PayCommissionComponent.emit({ type: 'close', data: null });
  }


  disableSubmitButton() {
    let error: boolean = false;
    if (this.dealerSelection === 'one_dealer') {
      error = this.payCommmissionForm.controls['dealer_id'].invalid || this.payCommmissionForm.controls['dealer_name'].invalid;
      if (this.amountTypeSelection === 'custom') {
        error = this.payCommmissionForm.controls['payable_amount'].invalid;
      }
    } else {
      error = this.daysCheck && this.payCommmissionForm.controls['days'].invalid;
    }
    return error;
  };

}
