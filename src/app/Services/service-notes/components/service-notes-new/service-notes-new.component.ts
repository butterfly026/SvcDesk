import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranService } from 'src/services';
import { SpinnerService } from 'src/app/Shared/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { ServiceNotesService } from '../../services';

@Component({
  selector: 'app-service-notes-new',
  templateUrl: './service-notes-new.component.html',
  styleUrls: ['./service-notes-new.component.scss'],
})
export class ServiceNotesNewComponent implements OnInit {

  noteForm: FormGroup;

  private unubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private serviceNoteService: ServiceNotesService,
    private spinnerService: SpinnerService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private tranService: TranService,
    public globService: GlobalService,
    private dialogRef: MatDialogRef<ServiceNotesNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { contactCode: string }
  ) { }

  ngOnInit(): void {
    this.noteForm = this.formBuilder.group({
      Note: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.alertService.closeAllAlerts();
    this.unubscribeAll$.next(null);
    this.unubscribeAll$.complete();
  }

  submitTrigger(): void {
    document.getElementById('submitButton').click();
  }

  submitForm(): void {
    this.spinnerService.loading();
    this.serviceNoteService.createServiceNote(this.noteForm.value, this.data.contactCode)
    .pipe(takeUntil(this.unubscribeAll$))
    .subscribe({
      next: () => {
        this.spinnerService.end();
        this.dialogRef.close('ok');
        this.tranService.errorMessageWithTime('ServiceNotesAdded');
      },
      error: error => {
        this.spinnerService.end();
        this.tranService.errorMessage(error);
      }
    });
  }

}
