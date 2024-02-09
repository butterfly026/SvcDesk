import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UntypedFormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TranService, ToastService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ContactPhoneTypeItem, ContactPhoneUsage } from 'src/app/model';
import { Permission, PermissionType } from 'src/app/Shared/models';
import { SpinnerService } from 'src/app/Shared/services';
import { DialogComponent, MatAlertComponent } from 'src/app/Shared/components';
import { ContactPhoneService } from '../../services';
import { ContactPhoneHistoryPage } from '..';

@Component({
  selector: 'app-contact-phone-component',
  templateUrl: './contact-phone-component.page.html',
  styleUrls: ['./contact-phone-component.page.scss'],
})
export class ContactPhoneComponentPage implements OnInit {

  @Input() ContactCode: string = '';
  @Output('ContactPhoneComponent') ContactPhoneComponent: EventEmitter<string> = new EventEmitter<string>();

  formGroup: FormGroup;
  saveState: boolean = false;
  phoneTypeList: ContactPhoneTypeItem[] = [];
  indexOfFormGroupValidatingPhoneNumber: number = null;
  
  private phoneNumberErrorMssageFromBackend: string;
  private orignalValue: string;
  private permissions: PermissionType[] = [];
  private mandatoryList: { Type: string, TypeCode: string}[] = [];
  private unsubscribeAll$: Subject<any> = new Subject<any>();
  
  constructor(
    private tranService: TranService,
    private contactPhoneService: ContactPhoneService,
    private spinnerService: SpinnerService,
    private formBuilder: UntypedFormBuilder,
    private toast: ToastService,
    public globService: GlobalService,
    private dialog: MatDialog,
  ) {
    this.tranService.translaterService();
  }

  ngOnInit(): void {
    this.getPermission();
  }

  get contactPhonesFormControl(): FormArray {
    return this.formGroup.get('ContactPhoneUsage') as FormArray;
  }

  addNewPhone(): void {
    this.contactPhonesFormControl.push(this.formBuilder.group({
      PhoneNumber: ['', [Validators.required, Validators.pattern('[0-9]{5,}')]],
      PhoneTypes: ['', Validators.required]
    }))
  }

  deletePhone(index): void {
    this.contactPhonesFormControl.removeAt(index);
  }

  submitTrigger(): void {
    document.getElementById('submitButton').click();
  }

  goBack(): void {
    if (this.saveState) {
      this.presentAlert();
    } else {
      this.ContactPhoneComponent.emit('close');
    }
  }
  
  presentAlert(): void {
    const dialog = this.dialog.open(MatAlertComponent, {
      width: '100%',
      maxWidth: '450px',
      data: {
        Title: this.tranService.instant('your_change_lost'),
        ErrorMessage: this.tranService.instant('are_you_sure'),
        ButtonName: this.tranService.instant('Yes'),
        ButtonOtherName: this.tranService.instant('Close')
      }
    });

    dialog.afterClosed().subscribe(res => {
      if (res === 'confirm') {
        this.ContactPhoneComponent.emit('close');
      }
    });
  }

  goToHistory(): void {
    this.dialog.open(DialogComponent, {
      width: '100%',
      maxWidth: '650px',
      panelClass: 'dialog',
      data: {
        component: ContactPhoneHistoryPage,
        contactCode: this.ContactCode
      }
    });
  }
  
  checkPermission(value: PermissionType[]): boolean {
    return value.every(s => this.permissions.includes(s));
  }
  
  checkPhoneNumberFromBackend(event: Event, i: number): void {
    if (this.contactPhonesFormControl.controls[i].get('PhoneNumber').valid) {
      this.indexOfFormGroupValidatingPhoneNumber = i;

      this.contactPhoneService.GetPhoneNumberValidationResult((event.target as HTMLInputElement).value)
        .pipe(takeUntil(this.unsubscribeAll$))
        .subscribe({
          next: result => {
            this.indexOfFormGroupValidatingPhoneNumber = null;
            if (!result.Valid) {
              this.phoneNumberErrorMssageFromBackend = result.Results.map(s => s.Message).toString();
              this.contactPhonesFormControl.controls[i].get('PhoneNumber').setErrors({
                'BackendValidation': !this.phoneNumberErrorMssageFromBackend ? this.tranService.instant('invalid_phone_number') : this.phoneNumberErrorMssageFromBackend
              });
            }
          },
          error: error => {
            this.indexOfFormGroupValidatingPhoneNumber = null;
            this.tranService.errorMessage(error);
          }
        })
    }
  }

  submitFormGroup(): void {
    if (!this.checkMandatoryList()) {
      this.toast.present(this.tranService.instant('EveryPhoneNumberMustHave') + ' ' + this.mandatoryList.map(s => s.Type + ','));
    } else {
      this.spinnerService.loading();
      
      const reqData = {
        ContactPhoneUsage: this.formGroup.value.ContactPhoneUsage.map((s) => ({
          ...s,
          PhoneTypes: s.PhoneTypes.map(t => ({ Code: t }))
        }))
      }

      this.contactPhoneService.ContactPhoneUsageUpdate(reqData, this.ContactCode)
        .pipe(takeUntil(this.unsubscribeAll$))
        .subscribe({
          next: () => {
            this.spinnerService.end();
            this.saveState = false;
            this.ContactPhoneComponent.emit('submitted');
            this.tranService.errorMessageWithTime('contact_phone_updated');
            this.goBack();
          },
          error: error => {
            this.spinnerService.end();
            this.tranService.errorMessage(error);
          }
        });
    }
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Contacts/ContactPhones', "").replace('/', "") as PermissionType);
  }

  private checkMandatoryList(): boolean {
    return this.mandatoryList.every(s => this.contactPhonesFormControl.value.every(t => t.PhoneTypes.includes(s.TypeCode)));
  }

  private getPhoneList(): void {
    this.spinnerService.loading();

    this.contactPhoneService.getPhoneList(this.ContactCode)        
    .pipe(takeUntil(this.unsubscribeAll$))
    .subscribe({
      next: (result: ContactPhoneUsage) => {      
        this.spinnerService.end();
        if (result === null) {
          this.tranService.errorMessage('no_phones');
        } else {
          this.phoneTypeList = result.ContactPhoneTypes;
          this.mandatoryList = result.ContactPhoneMandatoryRules;   
  
          this.formGroup = this.formBuilder.group({
            ContactPhoneUsage: new FormArray([])
          });
  
          result.ContactPhoneUsages.forEach(s => {
            this.contactPhonesFormControl.push(this.formBuilder.group({
              PhoneNumber: [s.PhoneNumber, [Validators.required, Validators.pattern('[0-9]{5,}')]],
              PhoneTypes: [s.PhoneTypes.map(t => t.Code), Validators.required]
            }));
          });
  
          this.orignalValue = JSON.stringify(this.orignalValue);
          this.formGroup.valueChanges
            .pipe(takeUntil(this.unsubscribeAll$))
            .subscribe(res => this.saveState = this.orignalValue !== JSON.stringify(res));
  
          if (!this.checkPermission(['Update'])) {
            this.formGroup.disable();
          }
        }
      },
      error: error => {
        this.spinnerService.end();
        this.tranService.errorMessage(error);
      }
    });
  }

  private getPermission(): void {
    this.spinnerService.loading();
    this.globService.getAuthorization('/Contacts/ContactPhones', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe(result => {
        this.formatPermissions(result);
        this.spinnerService.end();
        if (this.checkPermission([''])) {
          this.getPhoneList();
        } else {
          this.tranService.errorMessage('resource_forbidden');
          setTimeout(() => this.goBack(), 1000);
        }
      }, err => {
        this.spinnerService.end();
        const errResult = this.globService.ConvertKeysToLowerCase(err);
        this.tranService.errorMessage('resource_forbidden');
        if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
          // this.formGroup.disable();
          setTimeout(() => this.goBack(), 1000);
        }
      });
  }
}
