import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SpinnerService } from 'src/app/Shared/services';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { AlertService } from 'src/services/alert-service.service';
import { ContactsNotesService } from '../../services';

@Component({
  selector: 'app-contacts-notes-new',
  templateUrl: './contacts-notes-new.component.html',
  styleUrls: ['./contacts-notes-new.component.scss'],
})
export class ContactsNotesNewComponent implements OnInit, OnDestroy {

  noteForm: FormGroup;

  private unubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private contactsNoteService: ContactsNotesService,
    private spinnerService: SpinnerService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private tranService: TranService,
    public globService: GlobalService,
    private dialogRef: MatDialogRef<ContactsNotesNewComponent>,
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
    this.contactsNoteService.ContactNotesPost(this.noteForm.value, this.data.contactCode)
    .pipe(takeUntil(this.unubscribeAll$))
    .subscribe({
      next: () => {
        this.spinnerService.end();
        this.dialogRef.close('ok');
        this.tranService.errorMessageWithTime('ContactNotesAdded');
      },
      error: error => {
        this.spinnerService.end();
        this.tranService.errorMessage(error);
      }
    });
  }
}
