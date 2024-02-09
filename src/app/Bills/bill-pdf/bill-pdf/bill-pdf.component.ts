import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { BillPdfService } from './services/bill-pdf-service';

@Component({
  selector: 'app-bill-pdf-component',
  templateUrl: './bill-pdf.component.html',
  styleUrls: ['./bill-pdf.component.scss'],
})
export class BillPdfComponent implements OnInit {

  @Input() componentType: string = '';
  @Output() billPdfComponent: EventEmitter<string> = new EventEmitter<string>();

  billData: any;
  

  constructor(
    private loading: LoadingService,
    private billPdfService: BillPdfService,
    private tranService: TranService,
    
    public globService: GlobalService
  ) {
    
  }

  ngOnInit() {
    this.getBillData();
  }

  async getBillData() {
    await this.loading.present();
    this.billPdfService.getBillData().subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      this.billData = result;
      this.billData.taxInvoice.previousBalance = this.globService.getCurrencyConfiguration(this.billData.taxInvoice.previousBalance);
      this.billData.taxInvoice.paymentAdjust = this.globService.getCurrencyConfiguration(this.billData.taxInvoice.paymentAdjust);
      this.billData.taxInvoice.outstandingBalance = this.globService.getCurrencyConfiguration(this.billData.taxInvoice.outstandingBalance);
      this.billData.taxInvoice.currentCharges = this.globService.getCurrencyConfiguration(this.billData.taxInvoice.currentCharges);
      this.billData.taxInvoice.totalAmount = this.globService.getCurrencyConfiguration(this.billData.taxInvoice.totalAmount);

      this.billData.accountSummary.RPP = this.globService.getCurrencyConfiguration(this.billData.accountSummary.RPP);
      this.billData.accountSummary.GST = this.globService.getCurrencyConfiguration(this.billData.accountSummary.GST);
      this.billData.accountSummary.TOTAL = this.globService.getCurrencyConfiguration(this.billData.accountSummary.TOTAL);
      this.billData.accountSummary.taxable = this.globService.getCurrencyConfiguration(this.billData.accountSummary.taxable);

      this.billData.paymentSlip.amountPayable = this.globService.getCurrencyConfiguration(this.billData.paymentSlip.amountPayable);

      for (let list of this.billData.transactions.items) {
        list.GST = this.globService.getCurrencyConfiguration(list.GST);
        list.paid = this.globService.getCurrencyConfiguration(list.paid);
      }

      this.billData.transactions.total = this.globService.getCurrencyConfiguration(this.billData.transactions.total);

      for (let list of this.billData.outstandingItems) {
        list.originalAmount = this.globService.getCurrencyConfiguration(list.originalAmount);
        list.paidAmount = this.globService.getCurrencyConfiguration(list.paidAmount);
        list.outstandingAmount = this.globService.getCurrencyConfiguration(list.outstandingAmount);
      }

      this.billData.invester.extGST = this.globService.getCurrencyConfiguration(this.billData.invester.extGST);
      this.billData.invester.GST = this.globService.getCurrencyConfiguration(this.billData.invester.GST);
      this.billData.invester.incGST = this.globService.getCurrencyConfiguration(this.billData.invester.incGST);
      this.billData.invester.subTotal = this.globService.getCurrencyConfiguration(this.billData.invester.subTotal);

      for (let list of this.billData.invester.items) {
        list.extGST = this.globService.getCurrencyConfiguration(list.extGST);
        list.GST = this.globService.getCurrencyConfiguration(list.GST);
        list.incGST = this.globService.getCurrencyConfiguration(list.incGST);
      }

    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });
  }

  close() {
    this.billPdfComponent.emit('close');
  }

}
