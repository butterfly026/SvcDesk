import { ChangeDetectorRef, EventEmitter, Input, Inject, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { DelegationFormService } from './services/delegation-form.service';
import { SpinnerService } from 'src/app/Shared/services';
import { MatAlertService } from 'src/app/Shared/services/mat-alert.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BillDelegation } from '../../bilil-delegation.types';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-delegation-form',
  templateUrl: './delegation-form.component.html',
  styleUrls: ['./delegation-form.component.scss'],
})
export class DelegationFormComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() DelegationId: string = '';
  @Input() EditMode: string = 'New';
  @Output('DelegationFormComponent') DelegationFormComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();


  groupForm: UntypedFormGroup;

  reasonList: any;
  delegatorList: any;
  delegationData: any = null;

  fromPeriodList: any[] = [];
  toPeriodList: any[] = [];

  filterDelegateeList: any[] = [];
  showSpinner: boolean = false;

  constructor(
    private delegationService: DelegationFormService,
    private tranService: TranService,
    private spinnerService: SpinnerService,
    private matAlert: MatAlertService,

    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<DelegationFormComponent>,    
    @Inject(MAT_DIALOG_DATA) private dlgData: {
      ContactCode: string,
      DelegationId?: string,
    }
  ) {
    this.groupForm = this.formBuilder.group({
      DelegateeAccountId: ['', Validators.required],
      FromBillPeriod: ['', Validators.required],
      ToBillPeriod: ['', Validators.required],
      ReasonId: ['', Validators.required],
      Note: ['', Validators.required]
    });

    this.groupForm.get('ToBillPeriod').disable();
    this.groupForm.get('DelegateeAccountId').valueChanges.pipe(debounceTime(1000)).subscribe(async(result) => {
      if (result?.length > 2) {
        await this.getDelegateeList(result);
      }
    })

    this.groupForm.get('FromBillPeriod').valueChanges.subscribe(result => {
      if (result) {
        const index = this.fromPeriodList.findIndex(it => it?.id.toString() === result.toString());
        this.selectStartBillPeriod(index);
      }
    });

  }

  async ngOnInit() {
    if(this.dlgData?.ContactCode){
      this.ContactCode = this.dlgData.ContactCode;
    }
    if(this.dlgData?.DelegationId){
      this.DelegationId = this.dlgData.DelegationId;
    }
    await this.getPermission();
    await this.getBillRunExclusionPeriods();
    if (this.DelegationId) {
      await this.getBillDelegationDetail();
      await this.getBillDelegationReasons();
      // await this.getBillDelegationDelegators();
    } else {
      await this.getBillDelegationReasons();
      // await this.getBillDelegationDelegators();
    }
  }

  private async getPermission(): Promise<void> {
    await this.spinnerService.loading();
    this.globService.getAuthorization('/Accounts/Bills/Delegations/New')
      .subscribe({
        next: async (_result) => {
          await this.spinnerService.end();

        },
        error: async (err) => {
          await this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            setTimeout(() => {
              this.close();
            }, 1000);
          }
        }
      });
  }


  async getBillRunExclusionPeriods() {
    await this.spinnerService.loading();
    this.delegationService.getBillPeriods()
      .subscribe({
        next: async (_result) => {
          await this.spinnerService.end();
          this.fromPeriodList = this.globService.ConvertKeysToLowerCase(_result);

        },
        error: async (error) => {
          await this.spinnerService.end();
          this.tranService.matErrorMessage(error, (title, button, content) => {
            this.matAlert.alert(content, title, button);
          });
        }
      });

  }

  delegateSelected(plan) {
    for (let list of this.filterDelegateeList) {
      if (list.ContactCode === this.groupForm.get('DelegateeAccountId').value) {
        this.groupForm.get('DelegateeAccountId').setValue(list.ContactCode + ' ' + list.Name);
        break;
      }
    }
  }
  async getDelegateeList(filterStr: string) {
    if (this.groupForm.get('DelegateeAccountId').value) {
      this.showSpinner = true;
      const searchStr = this.groupForm.get('DelegateeAccountId').value ? this.groupForm.get('DelegateeAccountId').value : '';
      const reqParam = {
        SkipRecords: 0,
        TakeRecords: 100,
        SearchString: searchStr,
        BusinessUnitCode: 'DE',
      }

      this.delegationService.getBilLDelegatees(this.ContactCode, reqParam)
        .subscribe({
          next: async (_result) => {
            this.showSpinner = false;
            this.filterDelegateeList = _result ? _result : [];
          },
          error: async (error) => {
            this.showSpinner = false;
            this.tranService.errorToastOnly(error);
            this.filterDelegateeList = [];
          }
        });
    } else {
      this.filterDelegateeList = [];
    }
  }

  async getBillDelegationDetail() {
    this.groupForm.reset();
    await this.spinnerService.loading();
    this.delegationService.getBillDelegations(this.DelegationId)
      .subscribe({
        next: async (_result) => {
          await this.spinnerService.end();
          this.delegationData = this.globService.ConvertKeysToLowerCase(_result);
          this.groupForm.get('DelegateeAccountId').setValue(this.delegationData.delegateeaccountid + ' - ' + this.delegationData.delegateeaccount);
          this.groupForm.get('FromBillPeriod').setValue(this.delegationData.frombillperiod.toString());
          this.groupForm.get('ToBillPeriod').setValue(this.delegationData.tobillperiod.toString());
          this.groupForm.get('ReasonId').setValue(this.delegationData.reasonid);
          this.groupForm.get('Note').setValue(this.delegationData.note);
          // this.groupForm.get('DelegateeAccountId').disable();
          // this.groupForm.get('FromBillPeriod').disable();
          this.groupForm.get('ReasonId').disable();
          this.groupForm.get('ToBillPeriod').disable();
          this.groupForm.get('Note').disable();
        },
        error: async (error) => {
          await this.spinnerService.end();
          this.tranService.matErrorMessage(error, (title, button, content) => {
            this.matAlert.alert(content, title, button);
          });
        }
      });
  }

  async getBillDelegationReasons() {
    await this.spinnerService.loading();
    this.delegationService.getBillDelegationReasons()
      .subscribe({
        next: async (_result) => {
          await this.spinnerService.end();
          this.reasonList = this.globService.ConvertKeysToLowerCase(_result);

        },
        error: async (error) => {
          await this.spinnerService.end();
          this.tranService.matErrorMessage(error, (title, button, content) => {
            this.matAlert.alert(content, title, button);
          });
        }
      });
  }

  async getBillDelegationDelegators() {
    await this.spinnerService.loading();
    this.delegationService.getBillDelegationDelegators(this.ContactCode)
      .subscribe({
        next: async (_result) => {
          await this.spinnerService.end();
          this.delegatorList = this.globService.ConvertKeysToLowerCase(_result);

        },
        error: async (error) => {
          await this.spinnerService.end();
          this.tranService.matErrorMessage(error, (title, button, content) => {
            this.matAlert.alert(content, title, button);
          });
        }
      });
  }

  selectStartBillPeriod(index) {
    this.toPeriodList = [];
    for (let i = 0; i <= index; i++) {
      this.toPeriodList.push(this.fromPeriodList[i]);
    }

    if (!this.DelegationId) {
      this.groupForm.get('ToBillPeriod').enable();
      this.groupForm.get('ToBillPeriod').reset();
    } else {
      this.groupForm.get('ToBillPeriod').enable();
    }
  }

  close() {
    this.dialogRef.close();
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  async submitForm() {
    if (this.groupForm.valid) {
      await this.spinnerService.loading();

      if (this.DelegationId) {
        const reqBody = this.globService.convertRequestBody({
          ToBillPeriod: parseInt(this.groupForm.get('ToBillPeriod').value),
          ReasonId: parseInt(this.groupForm.get('ReasonId').value),
          Note: this.groupForm.get('Note').value
        });

        this.delegationService.updateBillDelegations(reqBody, this.delegationData.id).subscribe(async (result: any) => {
          await this.spinnerService.end();
          this.dialogRef.close('ok');
        }, async (error: any) => {
          await this.spinnerService.end();
          this.tranService.errorMessage(error);
        });
      } else {
        let delegateId = '';
        this.filterDelegateeList.forEach(dele => {
          if(dele.ContactCode + ' ' + dele.Name == this.groupForm.get('DelegateeAccountId').value)
            delegateId = dele.ContactCode;
        })
        const reqBody = this.globService.convertRequestBody({
          DelegateeAccountId: delegateId,
          FromBillPeriod: parseInt(this.groupForm.get('FromBillPeriod').value),
          ToBillPeriod: parseInt(this.groupForm.get('ToBillPeriod').value),
          ReasonId: parseInt(this.groupForm.get('ReasonId').value),
          Note: this.groupForm.get('Note').value
        });

        this.delegationService.createBillDelegations(reqBody, this.ContactCode).subscribe(async (result: any) => {
          await this.spinnerService.end();
          this.dialogRef.close('ok');
        }, async (error: any) => {
          await this.spinnerService.end();
          this.tranService.errorMessage(error);
        });
      }
    }
  }

}
