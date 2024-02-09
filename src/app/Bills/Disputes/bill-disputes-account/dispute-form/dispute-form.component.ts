import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { DisputeFormService } from './services/dispute-form.service';
import { debounceTime } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SpinnerService } from 'src/app/Shared/services';
import { MatAlertService } from 'src/app/Shared/services/mat-alert.service';
import { DisputeBill } from '../bill-disputes.types';

@Component({
  selector: 'app-dispute-form',
  templateUrl: './dispute-form.component.html',
  styleUrls: ['./dispute-form.component.scss'],
})
export class DisputeFormComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() DisputeID: any;
  @Output('DisputeFormComponent') DisputeFormComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();


  groupForm: UntypedFormGroup;

  disputeData: any;

  statusList = [
    { id: 'New', name: 'new' },
    { id: 'UnderAssessment', name: 'under_assessment' },
    { id: 'PendingClientAgreement', name: 'pending_client_agreement' },
    { id: 'PendingApproval', name: 'pending_approval' },
    { id: 'Approved', name: 'approved' },
    { id: 'Cancelled', name: 'cancelled' },
    { id: 'Declined', name: 'declined' },
    { id: 'OnHold', name: 'on_hold' },
    { id: 'ClosedPendingCredit', name: 'closed_pending_credit' },
    { id: 'ClosedCreditRaised', name: 'closed_credit_raised' },
  ];
  billItemList: DisputeBill[] = [];
  showSpinner: boolean = false;

  constructor(
    private disputeService: DisputeFormService,
    private tranService: TranService,
    private spinnerService: SpinnerService,
    private matAlert: MatAlertService,
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<DisputeFormComponent>,    
    @Inject(MAT_DIALOG_DATA) private dlgData: {
      ContactCode: string,
      DisputeID?: string,
    }
  ) {
    this.groupForm = this.formBuilder.group({
      Date: ['',],
      Status: ['', Validators.required],
      DisputedAmount: [0, Validators.required],
      Details: ['',],
      RaisedBy: ['',],
      ContactDetails: ['',],
      BillList: ['']
    });

    this.tranService.translaterService();
  }
  
  ngOnInit() {
    if(this.dlgData?.ContactCode){
      this.ContactCode = this.dlgData.ContactCode;
    }
    if(this.dlgData?.DisputeID){
      this.groupForm.addControl('ApprovedById', new UntypedFormControl('',));
      this.groupForm.addControl('ApprovalNotes', new UntypedFormControl('',));
      this.groupForm.addControl('SettlementAmount', new UntypedFormControl('',));
      this.groupForm.addControl('SettlementTax', new UntypedFormControl('',));
      this.groupForm.removeControl('BillList');
      this.DisputeID = this.dlgData.DisputeID;
    }
    if(this.DisputeID){
      this.getPermission('/Accounts/Bills/Disputes/Update');
    }else{
      this.getPermission('/Accounts/Bills/Disputes/New');
    }
  }
  private async getPermission(api: string): Promise<void> {
    await this.spinnerService.loading();
    this.globService.getAuthorization(api, true)
      .subscribe({
        next: async (_result) => {
          await this.spinnerService.end();
          if (this.DisputeID) {
            this.getBillDisputeDetails();
            
          } else {
            this.groupForm.get('Date').setValue(new Date());
      
            this.groupForm.get('BillList').valueChanges.pipe(debounceTime(1000)).subscribe(result => {
              this.getDisputeBills(result);
            })
          }
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
  focusOutField(){
    let arr = [];
    let checkVal: string = this.groupForm.get('BillList').value;
    let bExist: boolean = false;
    for (let list of this.billItemList) {
      if (list.BillNumber.toString() === checkVal) {
        bExist = true;
        break;
      }
    }
    if(!bExist){
      this.groupForm.get('BillList').setValue('');      
    }
  }

  async getBillDisputeDetails() {
    await this.spinnerService.loading();
    this.disputeService.getBillDisputeDetail(this.DisputeID).subscribe(async (result: any) => {
      await this.spinnerService.end();
      this.disputeData = this.globService.ConvertKeysToLowerCase(result);
      for (var key in this.groupForm.controls) {
        if (key === 'Date') {
          this.groupForm.get(key).setValue(new Date(this.disputeData[key.toLowerCase()]));
        } else {
          this.groupForm.get(key).setValue(this.disputeData[key.toLowerCase()]);
        }
      }
      this.groupForm.get('ApprovedById').setValue(result.ApprovedBy);
      this.groupForm.get('ApprovalNotes').setValue(result.ApprovalNotes);
      this.groupForm.get('SettlementAmount').setValue(result.SettlementAmount);
      this.groupForm.get('SettlementTax').setValue(result.SettlementTax);
    }, async (error: any) => {
      await this.spinnerService.end();
      this.tranService.errorMessage(error);
    });
  }

  async getDisputeBills(srchCriteria: string) {
    this.billItemList = [];
    this.showSpinner = true;
    this.disputeService.getDisputeBills(this.ContactCode, srchCriteria).subscribe(async (result: any) => {

      this.showSpinner = false;
      if (result === null) {
        this.billItemList = [];
      } else {        
        this.billItemList = result.Bills;
      }
    }, async (error: any) => {
      this.showSpinner = false;
      this.tranService.errorToastMessage(error);
    });
  }
  billSelected(item) {
    this.billItemList.forEach(bill => {
      if (bill.Id == this.groupForm.get('BillList').value) {
        this.groupForm.get('BillList').setValue(bill.BillNumber);
      }
    })
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

      if (this.DisputeID) {
        const reqBody = this.globService.convertRequestBody({
          Date: this.groupForm.get('Date').value,
          Status: this.groupForm.get('Status').value,
          DisputedAmount: this.groupForm.get('DisputedAmount').value,
          Details: this.groupForm.get('Details').value.replace(/\\\\/g, '\\'),
          RaisedBy: this.groupForm.get('RaisedBy').value,
          ContactDetails: this.groupForm.get('ContactDetails').value,
          ApprovedById: this.groupForm.get('ApprovedById').value,
          ApprovalNotes: this.groupForm.get('ApprovalNotes').value,
          SettlementAmount: this.groupForm.get('SettlementAmount').value,
          SettlementTax: this.groupForm.get('SettlementTax').value,
        });

        this.disputeService.updateBillDispute(reqBody, this.disputeData.id).subscribe(async (result: any) => {
          await this.spinnerService.end();
          this.dialogRef.close('ok');
        }, async (error: any) => {
          await this.spinnerService.end();
          this.tranService.matErrorMessage(error, (title, button, content) => {
            this.matAlert.alert(content, title, button);
          });
        });
      } else {
        const reqBody = this.globService.convertRequestBody({
          Date: this.groupForm.get('Date').value,
          Status: this.groupForm.get('Status').value,
          DisputedAmount: this.groupForm.get('DisputedAmount').value,
          Details: this.groupForm.get('Details').value,
          RaisedBy: this.groupForm.get('RaisedBy').value,
          ContactDetails: this.groupForm.get('ContactDetails').value
        });
        let billId: number = 0;
        this.billItemList.forEach(bill => {
          if (bill.BillNumber == this.groupForm.get('BillList').value) {
            billId = bill.Id;
          }
        })
        this.disputeService.createBillDisputes(reqBody, billId).subscribe(async (result: any) => {
          await this.spinnerService.end();
          this.dialogRef.close('ok');
        }, async (error: any) => {
          await this.spinnerService.end();
          this.tranService.matErrorMessage(error, (title, button, content) => {
            this.matAlert.alert(content, title, button);
          });
        });
      }
    }
  }

}
