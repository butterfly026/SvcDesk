import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TranService } from 'src/services';
import { SpinnerService } from 'src/app/Shared/services';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { ContactsNotesService } from '../../services';
import { Note } from '../../models';

@Component({
  selector: 'app-contacts-notes-edit',
  templateUrl: './contacts-notes-edit.component.html',
  styleUrls: ['./contacts-notes-edit.component.scss'],
})
export class ContactsNotesEditComponent implements OnInit, OnDestroy {

  noteForm: FormGroup;

  private unubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private contactsNoteService: ContactsNotesService,
    private spinnerService: SpinnerService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private tranService: TranService,
    public globService: GlobalService,
    private dialogRef: MatDialogRef<ContactsNotesEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { note: Note }
  ) { }

  ngOnInit(): void {
    this.getContactNote();
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
    this.contactsNoteService.updateContactNotes(this.noteForm.value, this.data.note.Id)
    .pipe(takeUntil(this.unubscribeAll$))
    .subscribe({
      next: () => {
        this.spinnerService.end();
        this.dialogRef.close('ok');
        this.tranService.errorMessageWithTime('ContactNotesUpdated');
      },
      error: error => {
        this.spinnerService.end();
        this.tranService.errorMessage(error);
      }
    });
  }

  private getContactNote(): void {
    this.spinnerService.loading();
    this.contactsNoteService.getContactNote(this.data.note.Id)
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
