import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-account-contract-commitment',
  templateUrl: './account-contract-commitment.component.html',
  styleUrls: ['./account-contract-commitment.component.scss'],
})
export class AccountContractCommitmentComponent implements OnInit {

  @Input() ContractData: any;
  @Output('AccountContractCommitmentComponent') AccountContractCommitmentComponent: EventEmitter<any> = new EventEmitter<any>();

  
  commitmentForm: UntypedFormGroup;

  typeList: any[] = [
    { id: 'Revenue', name: 'Revenue' },
    { id: 'Units', name: 'Units' },
  ];

  penaltyList: any[] = [
    { id: 'Penalty 1', name: 'Penalty 1' },
    { id: 'Penalty 2', name: 'Penalty 2' },
    { id: 'Penalty 3', name: 'Penalty 3' },
  ];

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    private modalCtrl: ModalController,
    
    public globService: GlobalService,
  ) {

    

    this.commitmentForm = this.formBuilder.group({
      Type: ['', Validators.required],
      Month: ['', Validators.required],
      ThresholdValue: ['', Validators.required],
      PenaltyMethod: ['', Validators.required],
    });

  }

  async ngOnInit() {

    if (this.ContractData) {
      this.commitmentForm.get('Type').setValue(this.ContractData.type);
      this.commitmentForm.get('Month').setValue(this.ContractData.month);
      this.commitmentForm.get('ThresholdValue').setValue(this.ContractData.thresholdvalue);
      this.commitmentForm.get('PenaltyMethod').setValue(this.ContractData.penaltymethod);
    }
  }

  close() {
    this.AccountContractCommitmentComponent.emit('close');
    this.modalCtrl.dismiss();
  }

  addCommitment() {
    document.getElementById('commitmentSubmitButton').click();
  }

  submitCommitmentForm() {
    if (this.commitmentForm.valid) {
      this.modalCtrl.dismiss(this.commitmentForm.value);
      this.AccountContractCommitmentComponent.emit(this.commitmentForm.value);
    }
  }

}
