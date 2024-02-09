import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { SpinnerService } from 'src/app/Shared/services';
import { ReportsInstancesService, ReportsListService } from '../../services';
import { ReportEmail, ReportParameter } from '../../models';

@Component({
  selector: 'app-reports-run-Now',
  templateUrl: './reports-run-now.component.html',
  styleUrls: ['./reports-run-now.component.scss'],
})
export class ReportsRunNowComponent implements OnInit, OnDestroy {

  runNowForm: FormGroup;
  parameters: ReportParameter[] = [];
  emails: Array<{ Selected?: boolean } & ReportEmail> = [];

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private reportsListService: ReportsListService,
    private reportsInstancesService: ReportsInstancesService,
    private spinnerService: SpinnerService,
    private formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<ReportsRunNowComponent>,
    public globService: GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: { reportId: string; reportName: string;}
  ) {}

  ngOnInit(): void {
    this.getParameters();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  get parametersFormControl(): FormArray {
    return this.runNowForm.get('Parameters') as FormArray;
  }

  get emailsFormControl(): FormArray {
    return this.runNowForm.get('Emails') as FormArray;
  }

  submitTrigger(): void {
    document.getElementById('submitButton').click();
  }

  submit(): void {
    this.runNowForm.get('Emails').setValue(
      this.emails.filter(s => s.Selected).map(s => ({ EmailId: s.Id, Log: true, Output: true }))
    );

    this.spinnerService.loading();
    this.reportsInstancesService.createReportInstance(this.runNowForm.value)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: () => {
          this.spinnerService.end();
          this.dialogRef.close();
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }
  
  private getParameters(): void {
    this.spinnerService.loading();

    this.reportsListService.getReport(this.data.reportId)
    .pipe(takeUntil(this.unsubscribeAll$))
    .subscribe({
      next: result => {
        this.spinnerService.end();
        this.runNowForm = this.formBuilder.group({
          RunImmedidately: true,
          Comments: '',
          ReportId: this.data.reportId,
          OutputFileName: '',
          Priority: 0,
          Parameters: this.formBuilder.array([]),
          Emails: null,
        });
  
        result.Parameters.forEach(s => {
          this.parametersFormControl.push(this.formBuilder.group({
            ReportParameterId: { disabled: s.Locked, value: s.Id },
            Value: [{ disabled: s.Locked, value: s.Default }, !s.Optional ? Validators.required : null]
          }));
        })
  
        this.parameters = result.Parameters;
        this.emails = result.Emails;
      },
      error: error => {
        this.spinnerService.end();
        this.tranService.errorMessage(error);
      }
    });
  }
}
