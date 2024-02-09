import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AccountIdentificationDocumentFormGroup, IdentificationType } from '../../../models';

@Component({
  selector: 'app-new-account-identification-documents-element',
  templateUrl: './new-account-identification-documents-element.component.html',
  styleUrls: ['./new-account-identification-documents-element.component.scss'],
})
export class NewAccountIdentificationDocumentsElementComponent implements OnInit {

  @Input() formGroup: FormGroup<AccountIdentificationDocumentFormGroup>;
  @Input() identificationTypes: IdentificationType[];
  @Output() onDeleteFormGroup = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

  deleteFormGroup(): void {
    this.onDeleteFormGroup.emit();
  }
}
