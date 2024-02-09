import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';

import { EventInstance } from 'src/app/Events/Instances/models';
import { FormatStringPipe } from 'src/app/Shared/pipes';

@Component({
  selector: 'app-contact-event-instance-details',
  templateUrl: './contact-event-instance-details.component.html',
  styleUrls: ['./contact-event-instance-details.component.scss'],
})
export class ContactEventInstanceDetailsComponent implements OnInit {

  eventForm: FormGroup;
  attributeColumns: string[] = ['Id', 'DefinitionId', 'Name', 'From', 'To', 'Value', 'LastUpdated', 'UpdatedBy'];

  constructor(
    private formBuilder: FormBuilder,
    private formatStringPipe: FormatStringPipe,
    public dialogRef: MatDialogRef<ContactEventInstanceDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventInstance,
  ) { }

  ngOnInit() {
    this.eventForm = this.formBuilder.group({
      Id: this.data.Id,
      Name: this.data.Name,
      Reason: this.data.Reason,
      Note: this.formatStringPipe.transform(this.data.Note),
      Reference: '',
      Alert: '',
      Priority: 0,

      // ScheduleInfo
      Due: this.checkDate(this.data.Due),
      ScheduleStatus: this.data.ScheduleStatus,
      StatusDateTime: this.checkDate(this.data.StatusDateTime),
      ScheduledBy: this.data.ScheduledBy,
      ScheduledTo: this.data.ScheduledTo,
      DepartmentScheduledTo: this.data.DepartmentScheduledTo,

      // Attributes
      Attributes: this.data.Attributes,

      // AdditionalInfo
      DefinitionId: this.data.DefinitionId,
      Code: this.data.Code,
      Type:  this.data.Type,
      CreatedBy: this.data.CreatedBy,
      Created: this.checkDate(this.data.Created)
    });
    this.eventForm.disable();  
  }

  close(): void {
    this.dialogRef.close();
  }

  showScheduleInfo(): boolean {
    const fields = ['Due', 'ScheduleStatus', 'StatusDateTime', 'ScheduledBy', 'ScheduledTo', 'DepartmentScheduledTo'];
    return fields.every(s => !!this.eventForm.get(s).value);
  }

  private checkDate(value: Date): string {
    return moment(value).format('YYYY-MM-DD hh:mm:ss') === 'Invalid date' 
      ? '' 
      : moment(value).format('YYYY-MM-DD hh:mm:ss');
  }

}
