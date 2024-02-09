import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingService, TranService } from 'src/services';
import { LoyaltyService } from '../services/loyalty.service';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-loyalty-detail',
  templateUrl: './loyalty-detail.page.html',
  styleUrls: ['./loyalty-detail.page.scss'],
})
export class LoyaltyDetailPage implements OnInit {

  @Input() ContactCode: string = '';
  @Input() LoyaltyType: string = '';

  @Output('LoyaltyDetailComponent') LoyaltyDetailComponent: EventEmitter<string> = new EventEmitter<string>();

  
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
    private loyaltyService: LoyaltyService,
    
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<LoyaltyDetailPage>,
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
      this.tranService.convertText('credit_loyalty').subscribe(result => {
        this.modalTitle = result;
      });
    } else if (this.data.LoyaltyType === 'Debit') {
      this.loyaltyForm = this.formBuilder.group({
        Total: ['', Validators.required],
        TranDate: ['', Validators.required],
        Reason: ['', Validators.required],
        Description: ['']
      });
      this.tranService.convertText('debit_loyalty').subscribe(result => {
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
