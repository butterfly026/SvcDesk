import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { takeUntil, finalize, switchMap, pairwise, startWith } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

import { LoadingService, TranService } from 'src/services';
import { ServiceNewPortingService, ServiceNewService } from '../../services';
import { FifthFormGroup, FirstFormGroup, ForthFormGroup, SecondFormGroup, ServiceConfiguration, ServiceNewAddressFormGroup, ServiceTypeItem, ThirdFormGroup } from '../../models';


@Component({
  selector: 'app-service-type',
  templateUrl: './service-type.component.html',
  styleUrls: ['./service-type.component.scss']
})
export class ServiceTypeComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() CurMenu: string = 'ServiceType';  

  @Output('ServiceTypeComponent') ServiceTypeComponent: EventEmitter<any> = new EventEmitter<any>();  
  @Output('ScrollServiceNewComponent') ScrollServiceNewComponent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('stepper') stepper: MatStepper;

  serviceConfiguration: ServiceConfiguration;
  firstFormGroup: FormGroup<FirstFormGroup>;
  serviceTypeList: ServiceTypeItem[] = [];

  secondFormGroup: FormGroup<SecondFormGroup>;
  thirdFormGroup: FormGroup<ThirdFormGroup>;
  forthFormGroup: FormGroup<ForthFormGroup>;
  fifthFormGroup: FormGroup<FifthFormGroup>;

  currentStepIndex: number = 0;

  private isSubmitStage: boolean;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private serviceNewService: ServiceNewService,
    private serviceNewPortingService: ServiceNewPortingService,
    private tranService: TranService,
    private loading: LoadingService,
    private formBuilder: FormBuilder,
  ){}

  ngOnInit(): void {
    this.firstFormGroup = this.formBuilder.group({
      ServiceTypeId: ['', Validators.required]
    });
    
    this.secondFormGroup = this.formBuilder.group({
      isPorting: false,
      ServiceId: ['', Validators.required],
      AccountNumber: ['', Validators.required],
      DOB: ['', Validators.required],
      LosingServiceProvider: ['', Validators.required],
      PortingIdentificationType: '',
      PortingIdentificationValue: '',
      PortAuthorityDate: new Date()
    });

    this.thirdFormGroup = this.formBuilder.group({
      ServiceId: ['', Validators.required],
      Plan: ['', Validators.required],
      PlanId: [''],
      PlanOptionId: ['', Validators.required],
      ConnectionDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      Status: [''],
      EnquiryPassword: [''],
      UserName: ['', Validators.maxLength(254)]
    });

    this.forthFormGroup = this.formBuilder.group({
      Attributes: this.formBuilder.array([])
    });

    this.fifthFormGroup = this.formBuilder.group({
      ContactAddressUsage: this.formBuilder.array<ServiceNewAddressFormGroup[]>([])
    });

    this.firstFormGroup.controls.ServiceTypeId.valueChanges
      .pipe(
        startWith(''),
        pairwise(),
        takeUntil(this.unsubscribeAll$)
      )
      .subscribe(([prev, next] )=> {
        if (prev) {
          this.stepper.steps.forEach((s, i) => i > 0 ? s.reset() : null);
        }
        this.getServiceConfiguration(next);
      });

    this.getServiceTypes();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  changeStep(event: StepperSelectionEvent): void {
    this.currentStepIndex = event.selectedIndex;
    this.isSubmitStage = event.selectedIndex + 2 === event.selectedStep._stepper._steps.length;
  }

  goToPriviousStage(): void {
    this.stepper.previous();
  }

  goToNextStage(): void {    
    if (this.isSubmitStage) {
      this.stepper.steps.get(this.currentStepIndex)._markAsInteracted();
      if (this.stepper.steps.get(this.currentStepIndex).stepControl.status === 'VALID') {
        this.createService();
      }
    } else {
      this.stepper.next();
    }
  }

  updateServiceId(value: string): void {
    this.thirdFormGroup.controls.ServiceId.setValue(value);
  }

  private async createService(): Promise<void> {
    await this.loading.present();
    this.serviceNewService.createNewService(null)
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(async () => await this.loading.dismiss())
      )
      .subscribe({
        next: () => this.stepper.next(),
        error: error => this.tranService.errorMessage(error)
      })
  }

  private async getServiceTypes(): Promise<void> {
    await this.loading.present();
    this.serviceNewService.getServiceTypes()
      .pipe(
        takeUntil(this.unsubscribeAll$), 
        finalize(async () => await this.loading.dismiss())
      )
      .subscribe({
        next: result => this.serviceTypeList = result,
        error: error => this.tranService.errorMessage(error)
      });
  }

  private async getServiceConfiguration(serviceTypeId: string): Promise<void> {
    await this.loading.present();
    this.serviceNewService.getServiceConfiguration(serviceTypeId)
      .pipe(
        takeUntil(this.unsubscribeAll$), 
        finalize(async () => await this.loading.dismiss()),
        switchMap(result => !result ? this.serviceNewService.getDefaultConfiguration() : of(result))
      )
      .subscribe({
        next: result => this.serviceConfiguration = result, 
        error: error => this.tranService.errorMessage(error),
      });
  }
}
