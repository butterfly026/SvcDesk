import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatAlertService } from 'src/app/Shared/services/mat-alert.service';
import { SpinnerService } from 'src/app/Shared/services';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { PaymentMethod, Permission } from 'src/app/Shared/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { InstallmentCycleType, InstallmentItem, InstallmentItemDetail, InstallmentStatusReason, StatusItem, PaymentMethodOption, PaymentMethodItem } from '../../models/installments.types';
import { AccountInstallmentsService } from '../../services/account-installments.services';

@Component({
  selector: 'app-account-installments-form',
  templateUrl: './account-installments-form.component.html',
  styleUrls: ['./account-installments-form.component.scss']
})
export class AccountInstallmentsFormComponent implements OnInit {
  @Input() ContactCode: string = '';

  InstallmentData: InstallmentItemDetail;
  installmentId: number;
  minDate: Date = new Date();
  editMode: string = 'New';
  formGroup: UntypedFormGroup;
  installmentDayList: number[];
  installmentStatusReasonList: InstallmentStatusReason[];
  installmentTypeList: InstallmentCycleType[] = ['Monthly', 'Weekly', 'Quarterly'];
  installmentStatusList: StatusItem[] = ['Open', 'Suspended', 'Cancelled', 'Completed'];
  showSpinner: boolean = false;
  nextInstallmentDueFilter: any;
  paymentMethodList: PaymentMethodItem[];
  eventParam = new PaymentMethodOption();

  constructor(
    private spinnerService: SpinnerService,
    private accountInstallmentsService: AccountInstallmentsService,
    private tranService: TranService,
    private matAlert: MatAlertService,
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<AccountInstallmentsFormComponent>,
    @Inject(MAT_DIALOG_DATA) private dlgData: {
      ContactCode: string,
      EditMode: string,
      InstallmentId?: number,
    }
  ) {
    this.tranService.translaterService();
    this.formGroup = this.formBuilder.group({
      InstallmentCycleType: ['', Validators.required],
      Amount: [0, Validators.required],
      InstallmentDay: [0, Validators.required],
      NextInstallmentDue: [''],
      Status: ['', Validators.required],
      StatusReasonId: [0],
      AccountPaymentMethodId: [0],
      Note: ['']
    });
    this.setInstallmentDayList();
    this.setNextInstallmentDueFilter();
  }

  ngOnInit(): void{
    if (this.dlgData?.ContactCode) {
      this.ContactCode = this.dlgData.ContactCode;
    }
    if (this.dlgData?.InstallmentId) {
      this.installmentId = this.dlgData.InstallmentId;
    }
    if (this.dlgData?.EditMode) {
      this.editMode = this.dlgData.EditMode;
    }
    if (this.editMode == 'New') {
      this.getPermission('/Accounts/Installments/New');
    } else {
      this.getPermission('/Accounts/Installments/Update');
    }
  }

  ngOnDestroy(): void {}
  
  selectPaymentMethod(event: PaymentMethod): void {
    this.formGroup.get('AccountPaymentMethodId').setValue(event ? event.Id : null);
  }

  private setInstallmentDayList(): void{
    this.installmentDayList = Array(31).fill(0).map((x, i) => i + 1);
  }

  private setNextInstallmentDueFilter(): void{
    this.nextInstallmentDueFilter = (d: Date | null): boolean => {
      const currentDate = new Date();
      const setDate = d || new Date();
      return currentDate < setDate;
    };
  }
  
  private async getPaymentMethodList(): Promise<void> {
    await this.spinnerService.loading();
    this.accountInstallmentsService.getPaymentMethodList(this.ContactCode, this.eventParam)
      .subscribe({
        next: async (result: PaymentMethodItem[]) => {
          this.spinnerService.end();
          this.paymentMethodList = result;
        },
        error: async (error: any) => {
          this.spinnerService.end();
          this.tranService.matErrorMessage(error, (title, button, content) => {            
          });
        }
      });
  }

  private async getPermission(url: string): Promise<void> {
    await this.spinnerService.loading();
    this.globService.getAuthorization(url)
      .subscribe({
        next: async (_result: Permission[]) => {
          await this.spinnerService.end();
          await this.getInstallmentsStatusReasons();
          await this.getPaymentMethodList();
          if ((this.editMode === 'Update' || this.editMode === 'View') && this.installmentId) {
            this.getInstallmentDetail(this.installmentId);
          }
        },
        error: async (err) => {
          await this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorToastOnly('resource_forbidden');
          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            setTimeout(() => {
              this.close();
            }, 1000);
          }
        }
      });
  }

  private async getInstallmentsStatusReasons(): Promise<void> {
    await this.spinnerService.loading();
    this.accountInstallmentsService.getInstallmentsStatusReasons()
      .subscribe({
        next: async (result: InstallmentStatusReason[]) => {
          this.spinnerService.end();
          this.installmentStatusReasonList = result;
        },
        error: async (error: any) => {
          this.spinnerService.end();
          this.tranService.matErrorMessage(error, (title, button, content) => {            
          });
        }
      })

  }

  private async getInstallmentDetail(installmentId: number): Promise<void> {
    await this.spinnerService.loading();
    this.accountInstallmentsService.getInstallmentDetail(installmentId)
      .subscribe({
        next: async (result: InstallmentItemDetail) => {
          this.spinnerService.end();
          this.formGroup.get('InstallmentCycleType').setValue(result.InstallmentCycleType);
          this.formGroup.get('Amount').setValue(result.Amount);
          this.formGroup.get('InstallmentDay').setValue(result.InstallmentDay);
          this.formGroup.get('NextInstallmentDue').setValue(result.NextInstallmentDue);
          this.formGroup.get('Status').setValue(result.Status);
          this.formGroup.get('StatusReasonId').setValue(result.StatusReasonId);
          this.formGroup.get('AccountPaymentMethodId').setValue(result.AccountPaymentMethodId);
          this.formGroup.get('Note').setValue(result.Note);
          this.formGroup.get('Amount').disable();
          if(this.editMode == 'View'){
            this.formGroup.get('InstallmentCycleType').disable();
            this.formGroup.get('InstallmentDay').disable();
            this.formGroup.get('NextInstallmentDue').disable();
            this.formGroup.get('Status').disable();
            this.formGroup.get('StatusReasonId').disable();
            this.formGroup.get('AccountPaymentMethodId').disable();
            this.formGroup.get('Note').disable();
          }
          
        },
        error: async (error: any) => {
          this.spinnerService.end();
          this.tranService.matErrorMessage(error, (title, button, content) => {            
          });
        }
      })
  }

  public close(): void {
    this.dialogRef.close();
  }

  private convertNullToEmptyString(obj: object): object {
    Object.keys(obj).forEach(key => {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        obj[key] = this.convertNullToEmptyString(obj[key]);
      } else {
        obj[key] = obj[key] === null ? '' : obj[key];
      }
    });
    return obj;
  }

  async saveInstallment(): Promise<void> {
    let reqData: InstallmentItem = {
      InstallmentCycleType: this.formGroup.get('InstallmentCycleType').value,
      Amount: this.formGroup.get('Amount').value,
      InstallmentDay: this.formGroup.get('InstallmentDay').value,
      NextInstallmentDue: this.formGroup.get('NextInstallmentDue').value ? this.formGroup.get('NextInstallmentDue').value : null,
      Status: this.formGroup.get('Status').value,
      StatusReasonId: this.formGroup.get('StatusReasonId').value ? this.formGroup.get('StatusReasonId').value : null,
      AccountPaymentMethodId: this.formGroup.get('AccountPaymentMethodId').value ? this.formGroup.get('AccountPaymentMethodId').value : null,
      Note: this.formGroup.get('Note').value ? this.formGroup.get('Note').value : '',
    };
    let reqFormBody: any = this.globService.convertRequestBody(reqData);
    if(reqFormBody.NextInstallmentDue){
      reqFormBody.NextInstallmentDue = moment(this.formGroup.get('NextInstallmentDue').value).format('YYYY-MM-DD');
    }

    await this.spinnerService.loading();
    if (this.editMode === 'Update' && this.installmentId) {
      this.accountInstallmentsService.updateInstallment(this.installmentId, reqFormBody)
        .subscribe({
          next: async (result) => {
            this.spinnerService.end();
            this.dialogRef.close('ok');
          },
          error: async (error: any) => {
            this.spinnerService.end();
            this.tranService.matErrorMessage(error, (title, button, content) => {            
            });
          }
        })
    } else if (this.editMode === 'New') {
      this.accountInstallmentsService.createInstallment(this.ContactCode, reqFormBody)
        .subscribe({
          next: async (result) => {
            this.spinnerService.end();
            this.dialogRef.close('ok');
          },
          error: async (error: any) => {
            this.spinnerService.end();
            this.tranService.matErrorMessage(error, (title, button, content) => {            
            });
          }
        })
    }

  }
    
  get isAmountValid(): boolean {
    return this.formGroup.get('Amount').value == 0 ? false : true;
  }
}
