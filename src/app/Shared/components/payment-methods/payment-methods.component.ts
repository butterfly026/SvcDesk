import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { PaymentMethod } from '../../models';
import { PaymentMethodsService } from '../../services';
import { SpinnerService } from './../../services/spinner.service';
import { DialogComponent } from '../dialog/dialog.component';
import { PaymentMethodsNewCreditCardComponent, PaymentMethodsNewBankAccountComponent } from '..';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss'],
})
export class PaymentMethodsComponent implements OnChanges, OnDestroy {

  @Input() contactCode: string;
  @Input() disabled: boolean;
  @Input() selectedPaymentMethodId: number;
  @Output() onSelectPaymentMethod = new EventEmitter<PaymentMethod>();

  paymentMethods: PaymentMethod[];
  selectedIndex: number;
  imagesForPaymentMethod: { Src: string; PaymentMethodCode: string }[] = [
    { Src: 'assets/imgs/payment/small_visa_icon.svg', PaymentMethodCode: 'VI' },
    { Src: 'assets/imgs/payment/small_two_point.svg', PaymentMethodCode: 'MC' },
    { Src: 'assets/imgs/payment/small_amex.svg', PaymentMethodCode: 'AM' },
    { Src: 'assets/imgs/payment/small_disc_ver.svg', PaymentMethodCode: 'DC' },
    { Src: 'assets/imgs/payment/direct-debit-1.svg', PaymentMethodCode: 'DD' }
  ];

  private dialogRef: MatDialogRef<any>;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    public globService: GlobalService,
    private spinnerService: SpinnerService,
    private paymentMethodsService: PaymentMethodsService,
    private tranService: TranService,
    private dialog: MatDialog
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.contactCode?.currentValue) {
      this.getPaymentMethods();
    }

    if (changes.selectedPaymentMethodId?.currentValue && this.paymentMethods) {
      this.selectedIndex = this.paymentMethods.findIndex(s => s.Id === this.selectedPaymentMethodId);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  selectPayment(index: number): void {    
    if (!this.disabled) {
      this.onSelectPaymentMethod.emit(this.selectedIndex === index ? null : this.paymentMethods[index]);
      this.selectedIndex = this.selectedIndex === index ? null : index;
    }
  }

  addNewCreditCard(): void {
    this.dialogRef = this.dialog.open(DialogComponent, {
      height: '100%',
      width: '100%',
      maxHeight: '550px',
      maxWidth: '600px',
      panelClass: 'dialog',
      data: {
        component: PaymentMethodsNewCreditCardComponent,
        contactCode: this.contactCode
      }
    });

    this.dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(res => {
        if (res === 'ok') {
          this.getPaymentMethods();
        }
      })
  }

  addNewBank() : void {
    this.dialogRef = this.dialog.open(DialogComponent, {
      height: '100%',
      width: '100%',
      maxHeight: '550px',
      maxWidth: '600px',
      panelClass: 'dialog',
      data: {
        component: PaymentMethodsNewBankAccountComponent,
        contactCode: this.contactCode
      }
    });

    this.dialogRef.afterClosed()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(res => {
        if (res === 'ok') {
          this.getPaymentMethods();
        }
      });
  }

  private getPaymentMethods(): void {
    this.spinnerService.loading();
    this.paymentMethodsService.getPaymentMethods(this.contactCode)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          result === null
            ? this.tranService.errorMessage('NoPaymentMethods')
            : this.paymentMethods = result;

          if (this.selectedPaymentMethodId && result) {
            this.selectedIndex = this.paymentMethods.findIndex(s => s.Id === this.selectedPaymentMethodId);
          }
        },
        error:  error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }

}
