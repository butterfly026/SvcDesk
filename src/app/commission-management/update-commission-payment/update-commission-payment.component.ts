import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LoadingService, ToastService, TranService } from 'src/services';
import { UUID } from 'angular2-uuid';
import { GlobalService } from 'src/services/global-service.service';
import { ComponentOutValue } from 'src/app/model';

@Component({
  selector: 'app-update-commission-payment',
  templateUrl: './update-commission-payment.component.html',
  styleUrls: ['./update-commission-payment.component.scss'],
})
export class UpdateCommissionPaymentComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() CommissionDetail: any;
  @Input() CommissionDetailItem: any;

  @Output('UpdateCommissionPaymentComponent') UpdateCommissionPaymentComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  updateCommissionPaymentForm: UntypedFormGroup;
  public themeColor: string = localStorage.currentTheme || 'base';

  constructor(
    private fb: UntypedFormBuilder,
    private tranService: TranService,
    private loading: LoadingService,
    public globService: GlobalService,
  ) {

    this.tranService.translaterService();

    this.updateCommissionPaymentForm = this.fb.group({
      dealer_id: [{ value: '', disabled: true }],
      dealer_name: [{ value: '', disabled: true }],
      payment_date: ['', Validators.required],
      calculated_amount: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      amount_to_pay: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      cheque_number: ['', Validators.required],
      comment: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.updateCommissionPaymentForm.get('dealer_id').setValue(this.CommissionDetail?.dealer_id);
    this.updateCommissionPaymentForm.get('dealer_name').setValue(this.CommissionDetail?.dealer_name);
    this.updateCommissionPaymentForm.get('payment_date').setValue(this.CommissionDetailItem?.paid_date);
    this.updateCommissionPaymentForm.get('calculated_amount').setValue(this.CommissionDetailItem?.calculated_amount);
    this.updateCommissionPaymentForm.get('amount_to_pay').setValue(this.CommissionDetailItem?.paid_amount);
    this.updateCommissionPaymentForm.get('cheque_number').setValue(this.CommissionDetailItem?.check_no);
    this.updateCommissionPaymentForm.get('comment').setValue(this.CommissionDetailItem?.comment);
  }


  saveForm() {
    const id = UUID.UUID();
    this.UpdateCommissionPaymentComponent.emit({ type: 'close', data: null })
  };

  goBack() {
    this.UpdateCommissionPaymentComponent.emit({ type: 'close', data: null })
  }

}
