import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { FinancialDocuments } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-bill-financial-documents-detail',
  templateUrl: './bill-financial-documents-detail.component.html',
  styleUrls: ['./bill-financial-documents-detail.component.scss'],
})
export class BillFinancialDocumentsDetailComponent implements OnInit {

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private dialogRef: MatDialogRef<BillFinancialDocumentsDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FinancialDocuments
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      ...this.data,
      Date: this.checkDate(this.data.Date),
      DueDate: this.checkDate(this.data.DueDate),
      Created: this.checkDate(this.data.Created),
      LastUpdated: this.checkDate(this.data.LastUpdated),
      Amount: this.globalService.getCurrencyConfiguration(this.data.Amount),
      TaxAmount: this.globalService.getCurrencyConfiguration(this.data.TaxAmount)      
    });
    this.form.disable();
  }

  close(): void {
    this.dialogRef.close();
  }

  private checkDate(value: Date): string {
    return moment(value).format('YYYY-MM-DD hh:mm:ss') === 'Invalid date' 
      ? '' 
      : moment(value).format('YYYY-MM-DD hh:mm:ss');
  }

}
