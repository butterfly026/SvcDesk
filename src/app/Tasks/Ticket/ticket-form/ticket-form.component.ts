import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { TicketFormService } from './services/ticket-form.service';
declare var CKEDITOR;

@Component({
  selector: 'app-account-task-new',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss'],
})
export class TicketFormComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('TicketFormComponent') TicketFormComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  ticketForm: UntypedFormGroup;
  templateContent: string = '';

  categoryList = [
    { id: 'category 1', text: 'Category 1' },
    { id: 'category 2', text: 'Category 2' },
    { id: 'category 3', text: 'Category 3' },
    { id: 'category 4', text: 'Category 4' },
    { id: 'category 5', text: 'Category 5' },
  ];

  taskList = [
    { id: 'task 1', text: 'Task 1' },
    { id: 'task 2', text: 'Task 2' },
    { id: 'task 3', text: 'Task 3' },
    { id: 'task 4', text: 'Task 4' },
    { id: 'task 5', text: 'Task 5' },
  ];

  statusList = [
    { id: 'status 1', text: 'Status 1' },
    { id: 'status 2', text: 'Status 2' },
    { id: 'status 3', text: 'Status 3' },
    { id: 'status 4', text: 'Status 4' },
    { id: 'status 5', text: 'Status 5' },
  ];

  requesterList = [
    { id: 'Requester 1', text: 'Requester 1' },
    { id: 'Requester 2', text: 'Requester 2' },
    { id: 'Requester 3', text: 'Requester 3' },
    { id: 'Requester 4', text: 'Requester 4' },
    { id: 'Requester 5', text: 'Requester 5' },
  ];

  priorityList = [
    { id: 'Priority 1', text: 'Priority 1' },
    { id: 'Priority 2', text: 'Priority 2' },
    { id: 'Priority 3', text: 'Priority 3' },
    { id: 'Priority 4', text: 'Priority 4' },
    { id: 'Priority 5', text: 'Priority 5' },
  ];

  resolutionList = [
    { id: 'Resolution 1', text: 'Resolution 1' },
    { id: 'Resolution 2', text: 'Resolution 2' },
    { id: 'Resolution 3', text: 'Resolution 3' },
    { id: 'Resolution 4', text: 'Resolution 4' },
    { id: 'Resolution 5', text: 'Resolution 5' },
  ];

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private ticketService: TicketFormService,
  ) {
    this.ticketForm = this.formBuilder.group({
      Category: ['', Validators.required],
      Task: ['', Validators.required],
      Status: ['', Validators.required],
      Requester: ['', Validators.required],
      Priority: ['', Validators.required],
      Number: ['', Validators.required],
      CustomerRef: ['', Validators.required],
      EmailAddress: ['', [Validators.required, Validators.email]],
      DisplayCustomer: [false],
      CreatedDate: ['', Validators.required],
      ComplatedDateState: [null],
      CompletedDate: ['', Validators.required],
      Resolution: ['', Validators.required],
      Followup: ['', Validators.required],
      FollowupState: [null],
      SLA: ['', Validators.required],
      SLAState: [null],
      ShortDescription: ['',],
      Details: ['',],
    });

    this.ticketForm.get('ComplatedDateState').valueChanges.subscribe(result => {
      if (result) {
        this.ticketForm.get('CompletedDate').enable();
        this.ticketForm.get('CompletedDate').setValidators([Validators.required]);
        this.ticketForm.get('CompletedDate').updateValueAndValidity();
      } else {
        this.ticketForm.get('CompletedDate').disable();
        this.ticketForm.get('CompletedDate').setValidators(null);
        this.ticketForm.get('CompletedDate').updateValueAndValidity();
      }
    });

    this.ticketForm.get('FollowupState').valueChanges.subscribe(result => {
      if (result) {
        this.ticketForm.get('Followup').enable();
        this.ticketForm.get('Followup').setValidators([Validators.required]);
        this.ticketForm.get('Followup').updateValueAndValidity();
      } else {
        this.ticketForm.get('Followup').disable();
        this.ticketForm.get('Followup').setValidators(null);
        this.ticketForm.get('Followup').updateValueAndValidity();
      }
    });

    this.ticketForm.get('SLAState').valueChanges.subscribe(result => {
      if (result) {
        this.ticketForm.get('SLA').enable();
        this.ticketForm.get('SLA').setValidators([Validators.required]);
        this.ticketForm.get('SLA').updateValueAndValidity();
      } else {
        this.ticketForm.get('SLA').disable();
        this.ticketForm.get('SLA').setValidators(null);
        this.ticketForm.get('SLA').updateValueAndValidity();
      }
    });

    this.ticketForm.get('ComplatedDateState').setValue(false);
    this.ticketForm.get('FollowupState').setValue(false);
    this.ticketForm.get('SLAState').setValue(false);
  }

  ngOnInit() { }

  get f() {
    return this.ticketForm.controls;
  }

  submitForm() {
    if (this.ticketForm.valid) {

    }
  }

  submitTrigger() {
    document.getElementById('ticketFormSubmitButton').click();
  }

  change() {
    const editResult = CKEDITOR.currentInstance.getData();
    this.ticketForm.get('Details').setValue(editResult);
  }

  goBack() {
    this.TicketFormComponent.emit({ type: 'close' });
  }

}
