import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { GlobalService } from 'src/services/global-service.service';
import { ForthFormGroup } from '../../models';
import { SpinnerService } from 'src/app/Shared/services';
import { TranService } from 'src/services';
import { ServiceAttributesService } from '../../services';

@Component({
  selector: 'app-service-new-attributes',
  templateUrl: './service-new-attributes.component.html',
  styleUrls: ['./service-new-attributes.component.scss']
})
export class ServiceNewAttributesComponent implements OnChanges, OnDestroy {

  @Input() formGroup: FormGroup<ForthFormGroup>;
  @Input() ServiceTypeId: string = '';

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    public globService: GlobalService,
    private spinnerService: SpinnerService,
    private attributesService: ServiceAttributesService,
    private formBuilder: FormBuilder,
  ) {}

  get serviceAttributeFormControl(): FormArray {
    return this.formGroup.controls.Attributes as FormArray;
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.ServiceTypeId?.currentValue) {
      this.serviceAttributeFormControl.clear();
      this.getServiceAttributes();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  private getServiceAttributes(): void {
    this.spinnerService.loading();
    this.attributesService.getAttributes(this.ServiceTypeId)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => {
          this.spinnerService.end();
          result.map(item => {
            this.serviceAttributeFormControl.push(
              this.formBuilder.group({
                Id: item.Id,
                Value: [item.DefaultValue, item.Required ? Validators.required : null],
                DataType: item.DataType,
                Name: item.Name,
              })
            );      
          });
        },
        error: error => {
          this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      });
  }
}
