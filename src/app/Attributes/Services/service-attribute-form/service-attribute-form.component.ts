import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComponentOutValue } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ServiceAttributeFormService } from './services/attribute-form.service';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { Subject, combineLatest, of } from 'rxjs';
import { GetServiceAttributeInstancesRequest, ServiceAttributeInstance } from '../../models/service-attribute-instance';
import { SpinnerService } from 'src/app/Shared/services';
import * as moment from 'moment';
import { MatAlertService } from 'src/app/Shared/services/mat-alert.service';

@Component({
  selector: 'app-service-attribute-form',
  templateUrl: './service-attribute-form.component.html',
  styleUrls: ['./service-attribute-form.component.scss'],
})
export class ServiceAttributeFormComponent implements OnInit {

  @Input() ServiceReference: number;
  @Input() ServiceId: string = '';
  @Input() EditMode: string = 'New';
  @Output('ServiceAttributeFormComponent') ServiceAttributeFormComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  showSpinner: boolean = false;
  groupForm: FormGroup;
  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private availableCall: boolean = true;
  private reqData: GetServiceAttributeInstancesRequest = {
    SkipRecords: 0,
    TakeRecords: 10,
    CountRecords: 'Y',
    SearchString: ''
  };
  definitionList: any[] = [];
  selectedDefinition: any;
  invalidValue: any = {
    results: [],
    valid: true,
  };
  updateData: ServiceAttributeInstance = null;

  secondInputType: string = 'text';

  constructor(
    private formBuilder: FormBuilder,
    private tranService: TranService,
    public globService: GlobalService,
    private spinnerService: SpinnerService,
    private matAlert: MatAlertService,
    private attService: ServiceAttributeFormService,
    private dialogRef: MatDialogRef<ServiceAttributeFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      ServiceReference: number,
      EditMode: string,
      Data?: ServiceAttributeInstance,
      ServiceId: string
    }
  ) {
    this.groupForm = this.formBuilder.group({
      Definition: ['', Validators.required],
      Value: ['', Validators.required],
      From: [new Date(), Validators.required],
      To: ['', Validators.required],
      ToDateType: ['1'],
    });
    this.groupForm.get('To').disable();
  }

  ngOnInit() {
    if (this.data?.ServiceReference) {
      this.ServiceReference = this.data.ServiceReference;
    }

    if (this.data?.ServiceId) {
      this.ServiceId = this.data.ServiceId;
    }

    if (this.data?.EditMode) {
      this.EditMode = this.data.EditMode;
    }

    if (this.data?.Data) {
      this.updateData = this.data.Data;
    }

    // this is for normal select list
    this.getDefinitions(this.reqData); // template search string


    this.groupForm.get('Value').valueChanges.pipe(
      debounceTime(500),
      takeUntil(this.unsubscribeAll$),
      filter(s => !!s)
    ).subscribe((result: any) => {
      if (result.length > 0) {
        this.getValues(result);
      }
    });


    this.groupForm.setValidators(this.dateRangeValidator);
    this.groupForm.setValidators(this.valueInputValidator);
  }

  valueInputValidator(formGroup: FormGroup) {
    const valueData = formGroup.get('Value').value;
    if (!valueData) {
      formGroup.get('Value').setErrors({ required: true });
    }
    return null;
  };

  dateRangeValidator(formGroup: FormGroup) {
    const fromDate = formGroup.get('From').value;
    const toDate = formGroup.get('To').value;
    if (!fromDate || !toDate) {
      if (!fromDate) {
        formGroup.get('From').setErrors({ required: true });
      } else if (!toDate) {
        formGroup.get('To').setErrors({ required: true });
      }
    } else if (fromDate > toDate) {
      // Set invalidRange error if fromDate is later than toDate
      formGroup.get('From').setErrors({ invalidRange: true });
      formGroup.get('To').setErrors({ invalidRange: true });
    } else {
      // Clear errors if validation passes
      formGroup.get('From').setErrors(null);
      formGroup.get('To').setErrors(null);
    }

    return null; // Validation passed
  }

  isInvalidRange() {
    const fromDateControl = this.groupForm.get('From');
    const toDateControl = this.groupForm.get('To');

    return fromDateControl.hasError('invalidRange') || toDateControl.hasError('invalidRange');
  }

  submitTrigger() {
    document.getElementById('serviceAttributeSubmitButton').click();
  }

  async submitForm() {
    if (this.groupForm.valid) {
      if (this.EditMode == 'New') {

        const reqBody = {
          DefinitionId: this.groupForm.get('Definition').value,
          Value: this.groupForm.get('Value').value,
          From: this.groupForm.get('From').value ? moment(this.groupForm.get('From').value).format('YYYY-MM-DD') : '',
          To: this.groupForm.get('ToDateType').value === 1 ? moment(this.groupForm.get('To').value).format('YYYY-MM-DD') : '9999-01-01',
        };
        await this.spinnerService.loading();
        this.attService.postAttributes(this.ServiceReference, this.globService.convertRequestBody(reqBody)).subscribe(async (result: any) => {
          await this.spinnerService.end();
          this.goBack('ok');
        }, async (error: any) => {
          await this.spinnerService.end();
          this.tranService.matErrorMessage(error, (title, button, content) => {
            this.matAlert.alert(content, title, button);
          });
        })
      } else if (this.EditMode == 'Update') {

        const reqBody = {
          Value: this.groupForm.get('Value').value,
          From: this.groupForm.get('From').value ? moment(this.groupForm.get('From').value).format('YYYY-MM-DD') : '',
        };
        await this.spinnerService.loading();
        this.attService.patchAttributes(this.updateData.Id, this.globService.convertRequestBody(reqBody)).subscribe(async (result: any) => {
          await this.spinnerService.end();
          this.goBack('ok');
        }, async (error: any) => {
          await this.spinnerService.end();
          this.tranService.matErrorMessage(error, (title, button, content) => {
            this.matAlert.alert(content, title, button);
          });
        })
      }

    }
  }

  private async getDefinitions(reqData) {
    await this.spinnerService.loading();
    this.attService.getDefinitions(this.ServiceReference, reqData)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) => {
          this.spinnerService.end();
          this.definitionList = this.globService.ConvertKeysToLowerCase(result)?.attributedefinitions;
          if (!this.definitionList || this.definitionList.length === 0) {
            this.tranService.errorToastOnly('no_definitions');
          }

          if (this.EditMode == 'Update' && this.updateData) {
            await this.getAttributeDetail();

          }
        },
        error: (error) => {
          this.tranService.errorMessage(error);
          this.spinnerService.end();
        }
      });
  }

  private async getAttributeDetail(){
    await this.spinnerService.loading();
    this.attService.getAttributeDetail(this.updateData.Id.toString())
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: (result) => {
          this.spinnerService.end();
          this.updateData = result;

          if (this.EditMode == 'Update' && this.updateData) {
            this.groupForm.get('Definition').setValue(this.updateData.DefinitionId);
            this.groupForm.get('Value').setValue(this.updateData.Value);
            this.groupForm.get('From').setValue(this.updateData.From);
            if (this.updateData.To.toString().startsWith('9999')) {
              this.groupForm.get('ToDateType').setValue(2);
              this.groupForm.get('To').disable();
            } else {
              this.groupForm.get('ToDateType').setValue(1);
              this.groupForm.get('To').enable();
              this.groupForm.get('To').setValue(this.updateData.To);
            }

          }
        },
        error: (error) => {
          this.tranService.errorMessage(error);
          this.spinnerService.end();
        }
      });
  }

  private getValues(value): void {

    if (this.selectedDefinition) {
      const reqParam = {
        ServiceTypeId: this.ServiceReference, // service reference id
        Id: this.selectedDefinition.id, // selected definition id
        Value: value // checking value
      };
      this.showSpinner = true;
      this.attService.getValues(reqParam)
        .pipe(takeUntil(this.unsubscribeAll$))
        .subscribe({
          next: (result) => {
            this.invalidValue = this.globService.ConvertKeysToLowerCase(result);
            if (!this.invalidValue.valid) {
              this.groupForm.get('Value').setErrors({ invalid: true });
            } else {
              this.groupForm.get('Value').setErrors(null);
            }
            this.showSpinner = false;
          },
          error: (error) => {
            this.tranService.errorMessage(error);
            this.showSpinner = false;
          }
        });
    }
  }

  async selectDefinition(selectedDefinitionId): Promise<void> {
    this.availableCall = false;
    this.selectedDefinition = this.definitionList.find(defenition => defenition.id == selectedDefinitionId);

    // dynamically change the Value input type according to the definition type
    switch (this.selectedDefinition.datatype) {
      case '0':
        this.secondInputType = 'text';
        break;
      case '1':
        this.secondInputType = 'number';
        break;
      case '2':
        this.secondInputType = 'date';
        break;
      default:
        this.secondInputType = 'text';
        break;
    }

  }

  async goBack(val?: string): Promise<void> {
    this.dialogRef.close(val);
  }

  switchDateType() {
    if (this.groupForm.get('ToDateType').value === 1) {
      this.groupForm.get('To').enable();
    } else {
      this.groupForm.get('To').disable();
    }
  }

}
