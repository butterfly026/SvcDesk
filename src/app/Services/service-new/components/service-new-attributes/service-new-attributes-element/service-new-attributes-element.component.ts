import { FormGroup } from '@angular/forms';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { debounceTime, finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { AttributeElementFormGroup, ServiceAttributeDataType } from '../../../models';
import { ServiceAttributesService } from '../../../services';

@Component({
  selector: 'app-service-new-attributes-element',
  templateUrl: './service-new-attributes-element.component.html',
  styleUrls: ['./service-new-attributes-element.component.scss'],
})
export class ServiceNewAttributesElementComponent implements OnChanges {

  @Input() ServiceTypeId: string = '';
  @Input() formGroup: FormGroup<AttributeElementFormGroup>;

  isLoading: boolean;
  defaultTypeCtlrls: ServiceAttributeDataType[] = ['Date', 'DateTime', 'Integer', 'Currency', 'Decimal', 'String'];

  private subscribtion: Subscription;

  constructor(
    private serviceAttributesService: ServiceAttributesService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.formGroup?.currentValue.controls.DataType.value !== 'Boolean') {
      this.formGroup.controls.Value.valueChanges
        .pipe(debounceTime(300))
        .subscribe(result => {
          this.subscribtion?.unsubscribe();
          this.isLoading = true;
          this.checkValidation(result);
        })
    }
  }

  private checkValidation(value): void {
    this.subscribtion= this.serviceAttributesService.checkValidation(this.ServiceTypeId, this.formGroup.controls.Id.value, value)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: res => {
          res.Valid
            ? this.formGroup.controls.Value.setErrors(null)
            : this.formGroup.controls.Value.setErrors({
                'invalid': res.Results.map(s => s.Result + ', ').toString()
              });
        }
      });
  }
}
