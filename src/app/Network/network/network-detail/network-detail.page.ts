import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';
import { NetworkService } from '../services/network.service';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-network-detail',
  templateUrl: './network-detail.page.html',
  styleUrls: ['./network-detail.page.scss'],
})
export class NetworkDetailPage implements OnInit {

  
  modalTitle: string = '';

  loyaltyForm: UntypedFormGroup;

  reasonType = [
    { Id: 'BR', Text: 'Bonus Reward' },
    { Id: 'MT', Text: 'Manual Transaction' },
    { Id: 'MR2', Text: 'Manual Reason 2' },
    { Id: 'MC', Text: 'Migration Credit' },
    { Id: 'RD', Text: 'Redemption' },
  ]

  constructor(
    private navCtrl: NavController,
    private loading: LoadingService,
    private tranService: TranService,
    private netService: NetworkService,
    
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<NetworkDetailPage>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
    
  }

  ngOnInit() {
    this.setPateType();
  }

  setPateType() {
    if (this.data.LoyaltyType === 'Credit') {
      this.loyaltyForm = this.formBuilder.group({
        Total: ['', Validators.required],
        TranDate: ['', Validators.required],
        ExpDate: ['', Validators.required],
        Reason: ['', Validators.required],
        Description: ['']
      });
      this.tranService.convertText('credit_network').subscribe(result => {
        this.modalTitle = result;
      });
    } else if (this.data.LoyaltyType === 'Debit') {
      this.loyaltyForm = this.formBuilder.group({
        Total: ['', Validators.required],
        TranDate: ['', Validators.required],
        Reason: ['', Validators.required],
        Description: ['']
      });
      this.tranService.convertText('debit_network').subscribe(result => {
        this.modalTitle = result;
      });
    }
  }

  closeModal() {
    this.dialogRef.close('cancelled');
  }

  submitTrigger() {
    document.getElementById('loyaltyDetailSubmit').click();
  }

  submitLoyaltyDetail() {
    this.dialogRef.close('success');
  }

}
