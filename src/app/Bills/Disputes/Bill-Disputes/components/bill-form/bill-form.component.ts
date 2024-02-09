import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { BillDisputesService } from '../../services';

@Component({
  selector: 'app-bill-form',
  templateUrl: './bill-form.component.html',
  styleUrls: ['./bill-form.component.scss'],
})
export class BillFormComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() DisputeID: any;
  @Input() billId: any;
  @Output('BillFormComponent') BillFormComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();


  groupForm: UntypedFormGroup;

  disputeData: any;

  statusList = [
    { id: 'New', name: 'new' },
    { id: 'UnderAssessment', name: 'under_assessment' },
    { id: 'PendingApproval', name: 'pending_approval' },
    { id: 'Approved', name: 'approved' },
    { id: 'Cancelled', name: 'cancelled' },
    { id: 'Declined', name: 'declined' },
    { id: 'OnHold', name: 'on_hold' },
    { id: 'ClosedPendingCredit', name: 'closed_pending_credit' },
    { id: 'ClosedCreditRaised', name: 'closed_credit_raised' },
  ];

  constructor(
    private loading: LoadingService,
    private disputeService: BillDisputesService,
    private tranService: TranService,

    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.groupForm = this.formBuilder.group({
      Date: ['',],
      Status: ['', Validators.required],
      DisputedAmount: [0, Validators.required],
      Details: ['',],
      RaisedBy: ['',],
      ContactDetails: ['',],
    });

    this.tranService.translaterService();
  }

  async ngOnInit() {
    if (this.DisputeID) {
      this.groupForm.addControl('ApprovedById', new UntypedFormControl('',));
      this.groupForm.addControl('ApprovalNotes', new UntypedFormControl('',));
      this.groupForm.addControl('SettlementAmount', new UntypedFormControl('',));
      this.groupForm.addControl('SettlementTax', new UntypedFormControl('',));
      await this.getBillDisputeDetails();
    } else {
      this.groupForm.get('Date').setValue(new Date());
    }
  }

  async getBillDisputeDetails() {
    await this.loading.present();
    this.disputeService.getBillDisputeDetail(this.DisputeID).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.disputeData = this.globService.ConvertKeysToLowerCase(result);
      for (var key in this.groupForm.controls) {
        if (key === 'Date') {
          this.groupForm.get(key).setValue(new Date(this.disputeData[key.toLowerCase()]));
        } else {
          this.groupForm.get(key).setValue(this.disputeData[key.toLowerCase()]);
        }
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  close() {
    this.BillFormComponent.emit({ type: 'close' });
  }

  submitTrigger() {
    document.getElementById('submitButton').click();
  }

  async submitForm() {
    if (this.groupForm.valid) {
      await this.loading.present();

      if (this.DisputeID) {
        const reqBody = this.globService.convertRequestBody({
          Date: this.groupForm.get('Date').value,
          Status: this.groupForm.get('Status').value,
          DisputedAmount: this.groupForm.get('DisputedAmount').value,
          Details: this.groupForm.get('Details').value,
          RaisedBy: this.groupForm.get('RaisedBy').value,
          ContactDetails: this.groupForm.get('ContactDetails').value,
          ApprovedById: this.groupForm.get('ApprovedById').value,
          ApprovalNotes: this.groupForm.get('ApprovalNotes').value,
          SettlementAmount: this.groupForm.get('SettlementAmount').value,
          SettlementTax: this.groupForm.get('SettlementTax').value,
        });

        this.disputeService.updateBillDispute(reqBody, this.disputeData.id).subscribe(async (result: any) => {
          await this.loading.dismiss();
          this.BillFormComponent.emit({ type: 'close' });
        }, async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
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

        this.disputeService.createBillDisputes(reqBody, this.billId).subscribe(async (result: any) => {
          await this.loading.dismiss();
          this.BillFormComponent.emit({ type: 'close' });
        }, async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        });
      }
    }
  }
}
