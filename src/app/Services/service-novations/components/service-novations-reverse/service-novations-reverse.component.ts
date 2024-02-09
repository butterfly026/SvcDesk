import { ServiceNovationsService } from './../../services/service-novations.service';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject, timer } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { SpinnerService } from 'src/app/Shared/services';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-service-novations-reverse',
  templateUrl: './service-novations-reverse.component.html',
  styleUrls: ['./service-novations-reverse.component.scss'],
})
export class ServiceNovationsReverseComponent implements OnDestroy {

  formGroup: FormGroup;

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private serviceNovationsService: ServiceNovationsService,
    private formBuilder: FormBuilder,
    private spinnerService: SpinnerService,
    private tranService: TranService,
    private dialogRef: MatDialogRef<ServiceNovationsReverseComponent>,
    public globService: GlobalService,
    @Inject(MAT_DIALOG_DATA) private data: { serviceReferenceId: number }
  ) {
    this.formGroup = this.formBuilder.group({
      Note: ''
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  submitTrigger(): void {
    document.getElementById('submitButton').click();
  }

  submitForm(): void {
    this.spinnerService.loading();
    this.serviceNovationsService.reverseRecentOne(this.formGroup.value, this.data.serviceReferenceId)
    .pipe(
      takeUntil(this.unsubscribeAll$),
      finalize(() => this.spinnerService.end())
    )
    .subscribe({
      next: () => {
        this.tranService.errorToastOnly('NovationReversedSuccessfully');
        timer(500)
          .pipe(takeUntil(this.unsubscribeAll$))
          .subscribe(() => this.dialogRef.close('ok'));
      },
      error: error => {
        this.tranService.errorMessage(error);
      }
    });
  }

}
