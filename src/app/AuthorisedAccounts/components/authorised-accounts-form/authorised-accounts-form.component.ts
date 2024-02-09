import { Component, Inject, OnInit } from '@angular/core';
import { AccountItemDetail, AuthorisedAccountItem, AuthorisedAccountItemDetail, AuthorisedAccountsAvailableResponse } from '../../models/authorised-accounts.types';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SpinnerService } from 'src/app/Shared/services';
import { AuthorisedAccountsService } from '../../services/authorised-accounts.services';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Permission } from 'src/app/Shared/models';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { Paging } from 'src/app/model';

@Component({
  selector: 'app-authorised-accounts-form',
  templateUrl: './authorised-accounts-form.component.html',
  styleUrls: ['./authorised-accounts-form.component.scss'],
})
export class AuthorisedAccountsFormComponent implements OnInit {
  AuthorisedAccountId: number;
  ContactCode: string;
  editMode: string = 'New';
  formGroup: UntypedFormGroup;
  minDate: Date;
  toDateFilter: any;

  showSpinner: boolean = false;

  accountsList: AccountItemDetail[] = [];
  filterAccountsList: AccountItemDetail[] = [];

  currentAccount: AccountItemDetail;
  availableCall: boolean = true;

  constructor(
    private spinnerService: SpinnerService,
    private authorisedAccountsService: AuthorisedAccountsService,
    private tranService: TranService,
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<AuthorisedAccountsFormComponent>,
    @Inject(MAT_DIALOG_DATA) private dlgData: {
      EditMode: string,
      AuthorisedAccountId?: number,
      ContactCode: string,
    }
  ) {
    this.tranService.translaterService();
    this.formGroup = this.formBuilder.group({
      AccountId: ['', Validators.required],
      From: ['', Validators.required],
      To: ['', Validators.required],
    });}

  async ngOnInit() {
    if (this.dlgData?.ContactCode) {
      this.ContactCode = this.dlgData.ContactCode;
    }
    if (this.dlgData?.AuthorisedAccountId) {
      this.AuthorisedAccountId = this.dlgData.AuthorisedAccountId;
    }
    if (this.dlgData?.EditMode) {
      this.editMode = this.dlgData.EditMode;
    }
    if (this.editMode == 'New') {
      this.getPermission('/Contacts/AuthorisedAccounts/New');
      this.formGroup.get('From').setValue(new Date());
      this.formGroup.get('To').setValue(new Date('9999-12-31T00:00:00.000Z'));
      this.minDate = new Date();

      this.filterAccountsList = this.filter('');
  
      this.formGroup.get('AccountId').valueChanges.pipe(debounceTime(1000)).subscribe(async (result: any) => {
        if (result) {
          if (this.availableCall) {
            this.showSpinner = true;
            await this.getAccountsList();
            this.showSpinner = false;
            this.filterAccountsList = this.filter(result);
          }
          this.availableCall = true;
        }
      });
  
      await this.getAccountsList();
    } else {
      if (this.editMode == 'Update') {
        this.getPermission('/Contacts/AuthorisedAccounts/Update');
      } else {
        this.getPermission('/Contacts/AuthorisedAccounts/Details');
      }
    }

    this.setToDateFilter();
  }

  ngOnDestroy(): void {}

  onDateChange1(event: any) {
    this.minDate = new Date(event.target.value);
    this.setToDateFilter();
  }

  onDateChange2(event: MatDatepickerInputEvent<Date>) {
    this.minDate = event.value;
    this.setToDateFilter();
  }

  private setToDateFilter(): void{
    this.toDateFilter = (d: Date | null): boolean => {
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
          if ((this.editMode === 'Update' || this.editMode === 'View') && this.AuthorisedAccountId) {
            this.getAuthorisedAccountDetail(this.AuthorisedAccountId);
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

  private async getAuthorisedAccountDetail(AuthorisedAccountId: number): Promise<void> {
    await this.spinnerService.loading();
    this.authorisedAccountsService.getAuthorisedAccount(AuthorisedAccountId)
      .subscribe({
        next: async (result: AuthorisedAccountItemDetail) => {
          this.spinnerService.end();
          this.currentAccount = {
            ...this.currentAccount,
            Id: result.AccountId,
          };
          this.formGroup.get('AccountId').setValue(`${result.Name} [${result.AccountId}]`);
          this.formGroup.get('From').setValue(moment(result.From));
          this.formGroup.get('To').setValue(moment(result.To));
          this.formGroup.get('AccountId').disable();
          this.formGroup.get('From').disable();
          this.minDate = new Date(result.From);
          if(this.editMode == 'View'){
            this.formGroup.get('To').disable();
          }
        },
        error: async (error: any) => {
          this.spinnerService.end();
          this.tranService.matErrorMessage(error, (title, button, content) => {            
          });
        }
      });
  }

  async saveAuthorisedAccount(): Promise<void> {
    let reqData: AuthorisedAccountItem = {
      AccountId: this.currentAccount.Id,
      From: this.formGroup.get('From').value.format('YYYY-MM-DDT00:00:00.000Z'),
      To: this.formGroup.get('To').value.format('YYYY-MM-DDT00:00:00.000Z'),
    };
    let reqFormBody: any = this.globService.convertRequestBody(reqData);

    await this.spinnerService.loading();
    if (this.editMode === 'Update' && this.AuthorisedAccountId) {
      this.authorisedAccountsService.updateAuthorisedAccount(this.AuthorisedAccountId, reqFormBody)
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
      this.authorisedAccountsService.createAuthorisedAccount(this.ContactCode, reqFormBody)
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
        });
    }
  }

  filter(value: string): AccountItemDetail[] {
    const filterValue = value.toLowerCase();
    return this.accountsList.filter(row => row.Name.toLowerCase().includes(filterValue));
  }

  private async getAccountsList(): Promise<void> {
    const reqData = {
      SearchString: this.formGroup.get('AccountId').value,
    };

    try {
      const result = await this.authorisedAccountsService.getAuthorisedAccountsAvailable(reqData, this.ContactCode).toPromise();
      if (result?.Items) {
        this.accountsList = result.Items;
      }
    } catch (error) {
      this.tranService.errorMessage(error);
    }
  }

  async optionSelected(event) {
    this.availableCall = false;
    let currentAccountId = this.formGroup.get('AccountId').value;
    for (let list of this.filterAccountsList) {
      if (currentAccountId === list.Id) {
        this.currentAccount = list;
        this.formGroup.get('AccountId').setValue(`${list.Name} [${list.Id}]`);
      }
    }
  }

  public close(): void {
    this.dialogRef.close();
  }
}
