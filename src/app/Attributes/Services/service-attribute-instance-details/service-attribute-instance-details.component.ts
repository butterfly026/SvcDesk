import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import * as moment from 'moment';

import { ServiceAttributeInstance } from '../../models/service-attribute-instance';

@Component({
  selector: 'app-service-attribute-instance-details',
  templateUrl: './service-attribute-instance-details.component.html',
  styleUrls: ['./service-attribute-instance-details.component.scss'],
})
export class ServiceAttributeInstanceDetailsComponent implements OnInit {

  detailForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ServiceAttributeInstanceDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ServiceAttributeInstance,
  ) { }

  ngOnInit() {
    this.detailForm = this.formBuilder.group({
      DefinitionId: this.data.DefinitionId,
      Editable: this.data.Editable,
      EventId: this.data.EventId,
      From: this.checkDate(this.data.From),
      Id: this.data.Id,
      LastUpdated: this.checkDate(this.data.LastUpdated),
      Name: this.data.Name,
      To: this.checkDate(this.data.To),
      UpdatedBy: this.data.UpdatedBy,
      Value: this.data.Value
    });
    this.detailForm.disable(); 
  }

  private checkDate(value: Date): string {
    return moment(value).format('YYYY-MM-DD hh:mm:ss') === 'Invalid date' 
      ? '' 
      : moment(value).format('YYYY-MM-DD hh:mm:ss');
  }

  close(): void {
    this.dialogRef.close();
  }

}
