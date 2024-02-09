import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TranService } from 'src/services';
import { SpinnerService } from 'src/app/Shared/services';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { ServiceNotesService } from '../../services';
import { Note } from '../../models';

@Component({
  selector: 'app-service-notes-edit',
  templateUrl: './service-notes-edit.component.html',
  styleUrls: ['./service-notes-edit.component.scss'],
})
export class ServiceNotesEditComponent implements OnInit, OnDestroy {

  noteForm: FormGroup;

  private unubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private serviceNoteService: ServiceNotesService,
    private spinnerService: SpinnerService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private tranService: TranService,
    public globService: GlobalService,
    private dialogRef: MatDialogRef<ServiceNotesEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { note: Note }
  ) { }

  ngOnInit(): void {
    this.getServiceNote();
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
    this.serviceNoteService.updateServiceNote(this.noteForm.value, this.data.note.Id)
    .pipe(takeUntil(this.unubscribeAll$))
    .subscribe({
      next: () => {
        this.spinnerService.end();
        this.dialogRef.close('ok');
        this.tranService.errorMessageWithTime('ServiceNotesUpdated');
      },
      error: error => {
        this.spinnerService.end();
        this.tranService.errorMessage(error);
      }
    });
  }

  private getServiceNote(): void {
    this.spinnerService.loading();
    this.serviceNoteService.getServiceNote(this.data.note.Id)
      .pipe(takeUntil(this.unubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          this.noteForm = this.formBuilder.group({
            Note: [result.Body, Validators.required]
          });
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
          this.dialogRef.close();
        }
      })
  }

}
