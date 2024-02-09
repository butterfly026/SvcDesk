import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatAlertService } from 'src/app/Shared/services/mat-alert.service';
import { SpinnerService } from 'src/app/Shared/services';
import { AccountDepositsService } from '../../services/account-deposits.services';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { Permission } from 'src/app/Shared/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DepositItem, DepositItemDetail, DepositStatusReason, DepositType, StatusItem } from '../../deposits.types';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-account-deposits-form',
  templateUrl: './account-deposits-form.component.html',
  styleUrls: ['./account-deposits-form.component.scss']
})
export class AccountDepositsFormComponent implements OnInit {
  @Input() ContactCode: string = '';

  DepositData: DepositItemDetail;
  depositId: string = '';
  editMode: string = 'New';
  formGroup: UntypedFormGroup;
  depositTypeList: DepositType[] = ['Roaming', 'Security', 'IDD', 'Other'];
  depositStatusReasonList: DepositStatusReason[];
  depositStatusList: StatusItem[] = ['Open', 'On hold', 'Approved', 'Declined', 'Refunded', 'Cancel'];
  showSpinner: boolean = false;
  minDate: Date = null;
  expiryDateFilter: any;

  constructor(
    private spinnerService: SpinnerService,
    private accountDepositsService: AccountDepositsService,
    private tranService: TranService,
    private matAlert: MatAlertService,
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<AccountDepositsFormComponent>,
    @Inject(MAT_DIALOG_DATA) private dlgData: {
      ContactCode: string,
      EditMode: string,
      DepositId?: string,
    }
  ) {
    this.tranService.translaterService();
    this.formGroup = this.formBuilder.group({
      Type: ['', Validators.required],
      Amount: [0, Validators.required],
      DisputedAmount: [0, Validators.required],
      Date: ['', Validators.required],
      ExpiryDate: [''],
      Status: ['', Validators.required],
      StatusReasonId: ['', Validators.required],
      Note: ['']
    });

  }

  ngOnInit() {
    if (this.dlgData?.ContactCode) {
      this.ContactCode = this.dlgData.ContactCode;
    }
    if (this.dlgData?.DepositId) {
      this.depositId = this.dlgData.DepositId;
    }
    if (this.dlgData?.EditMode) {
      this.editMode = this.dlgData.EditMode;
    }
    if (this.editMode == 'New') {
      this.getPermission('/Accounts/Deposits/New');
    } else {
      this.getPermission('/Accounts/Deposits/Update');
    }
    this.setExpiryDateFilter();
  }

  ngOnDestroy(): void {}

  onDateChange1(event: any) {
    this.minDate = new Date(event.target.value);
    this.setExpiryDateFilter();
  }

  onDateChange2(event: MatDatepickerInputEvent<Date>) {
    this.minDate = event.value;
    this.setExpiryDateFilter();
  }

  private setExpiryDateFilter(): void{
    this.expiryDateFilter = (d: Date | null): boolean => {
      if (this.minDate === null){
        return false;
      }
      const setDate = d || new Date();
      return this.minDate < setDate;
    };
  }

  private async getPermission(url: string): Promise<void> {
    await this.spinnerService.loading();
    this.globService.getAuthorization(url)
      .subscribe({
        next: async (_result: Permission[]) => {
          await this.spinnerService.end();
          await this.getDepositStatusReason();
          if ((this.editMode === 'Update' || this.editMode === 'View') && this.depositId) {
            this.getDepositDetail(this.depositId);
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

  private async getDepositStatusReason(): Promise<void> {
    await this.spinnerService.loading();
    this.accountDepositsService.getDepositStatusReasons()
      .subscribe({
        next: async (result: DepositStatusReason[]) => {
          this.spinnerService.end();
          this.depositStatusReasonList = result;
        },
        error: async (error: any) => {
          this.spinnerService.end();
          this.tranService.matErrorMessage(error, (title, button, content) => {            
          });
        }
      })

  }

  private async getDepositDetail(depositId: string): Promise<void> {
    await this.spinnerService.loading();
    this.accountDepositsService.getDepositDetail(depositId)
      .subscribe({
        next: async (result: DepositItemDetail) => {
          this.spinnerService.end();
          this.formGroup.get('Type').setValue(result.Type);
          this.formGroup.get('Amount').setValue(result.Amount);
          this.formGroup.get('Date').setValue(result.Date);
          this.formGroup.get('ExpiryDate').setValue(result.ExpiryDate);
          this.formGroup.get('Status').setValue(result.Status);
          this.formGroup.get('StatusReasonId').setValue(result.StatusReasonId);
          this.formGroup.get('Note').setValue(result.Note);
          if(this.editMode == 'View'){
            this.formGroup.get('Type').disable();
            this.formGroup.get('Amount').disable();
            this.formGroup.get('Date').disable();
            this.formGroup.get('ExpiryDate').disable();
            this.formGroup.get('Status').disable();
            this.formGroup.get('StatusReasonId').disable();
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
  async saveDeposit(): Promise<void> {
    let reqData: DepositItem = {
      Type: this.formGroup.get('Type').value,
      Amount: this.formGroup.get('Amount').value,
      Date: this.formGroup.get('Date').value,
      ExpiryDate: this.formGroup.get('ExpiryDate').value ? this.formGroup.get('ExpiryDate').value : null,
      Status: this.formGroup.get('Status').value,
      StatusReasonId: this.formGroup.get('StatusReasonId').value,
      Note: this.formGroup.get('Note').value ? this.formGroup.get('Note').value : '',
    }
    let reqFormBody: any = this.convertNullToEmptyString(this.globService.convertRequestBody(reqData));
    if(reqFormBody.ExpiryDate){
      console.log(moment(this.formGroup.get('ExpiryDate').value));
      reqFormBody.ExpiryDate = moment(this.formGroup.get('ExpiryDate').value).format('YYYY-MM-DD');
    }
    if(reqFormBody.Date){
      reqFormBody.Date = moment(this.formGroup.get('Date').value).format('YYYY-MM-DD');
    }

    await this.spinnerService.loading();
    if (this.editMode === 'Update' && this.depositId) {
      this.accountDepositsService.updateDeposit(this.depositId, reqFormBody)
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
      this.accountDepositsService.createDeposit(this.ContactCode, this.globService.convertRequestBody(reqData))
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
