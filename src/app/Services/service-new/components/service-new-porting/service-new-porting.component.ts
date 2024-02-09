import { Component, EventEmitter, Input, OnChanges, OnDestroy, SimpleChanges, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { take, takeUntil, filter, debounceTime, finalize, pairwise, startWith } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { IdentificationType, SecondFormGroup, ServiceProvider } from '../../models';
import { ServiceNewPortingService } from '../../services';
import { TranService } from 'src/services';

@Component({
  selector: 'app-service-new-porting',
  templateUrl: './service-new-porting.component.html',
  styleUrls: ['./service-new-porting.component.scss'],
})
export class ServiceNewPortingComponent implements OnChanges, OnDestroy {
  
  @Input() formGroup: FormGroup<SecondFormGroup>;
  @Input() ServiceTypeId: string = '';
  @Output() onUpdateServiceId = new EventEmitter<string>();

  portingEnabled: boolean;
  serviceProviders: ServiceProvider[] = [];
  IdentificationTypes: IdentificationType[] = [];

  isLoadingServiceId: boolean;

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private serviceNewPortingService: ServiceNewPortingService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getServiceProviders();
    this.getPortingIdentifications();

    if (changes.formGroup?.currentValue) {
      this.handleFormGroup('disable');
      this.formGroup.controls.isPorting.valueChanges
        .pipe(takeUntil(this.unsubscribeAll$))
        .subscribe(result => {
          if (!!result) {
            this.handleFormGroup('enable');
          } else {
            this.handleFormGroup('reset');
            this.handleFormGroup('disable');
            this.onUpdateServiceId.emit('');
          }
        });

      this.formGroup.controls.PortingIdentificationType.valueChanges
        .pipe(
          filter(result => !!result),
          take(1)
        )
        .subscribe(() => {
          this.formGroup.controls.PortingIdentificationValue.setValidators(Validators.required);
          this.formGroup.controls.PortingIdentificationValue.updateValueAndValidity();
        });
      
      this.formGroup.controls.ServiceId.valueChanges
        .pipe(
          startWith(''),
          pairwise(),
          takeUntil(this.unsubscribeAll$),
          debounceTime(1000),
        )
        .subscribe(([prev, next])=> {
          if (prev !== next) {
            !!next 
              ? this.checkValidationForServiceId(next)
              : this.onUpdateServiceId.emit('');
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  private handleFormGroup(val: 'disable' | 'enable' | 'reset'): void {
    Object.keys(this.formGroup.controls).forEach(s => {
      if (s !== 'isPorting') {
        switch(val) {
          case 'disable':
            this.formGroup.controls[s].disable();
            break;
          case 'enable':
            this.formGroup.controls[s].enable();
            break;
          case 'reset':
            this.formGroup.controls[s].reset();
            break;
        }
      }
    })
  }

  private getServiceProviders(): void {
    this.serviceNewPortingService.getServiceProviders()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.serviceProviders = result,
        error: error => this.tranService.errorMessage(error)
      })
  }
  
  private getPortingIdentifications(): void {
    this.serviceNewPortingService.getPortingIdentifications()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: result => this.IdentificationTypes = result,
        error: error => this.tranService.errorMessage(error)
      })
  }

  private checkValidationForServiceId(serviceId: string): void {
    this.isLoadingServiceId = true;
    this.serviceNewPortingService.checkValidationForServiceId(this.ServiceTypeId, serviceId)
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(async () => this.isLoadingServiceId = false)
      )
      .subscribe({
        next: result => {
          if (result.Valid) {
            this.formGroup.controls.ServiceId.setErrors(null);
            this.onUpdateServiceId.emit(serviceId);
          } else {
            this.formGroup.controls.ServiceId.setErrors({
              'invalid': result.Results.map(s => s.Result + ', ').toString()
            });
          }
        },
        error: error => this.tranService.errorMessage(error)
      })
  }
}
