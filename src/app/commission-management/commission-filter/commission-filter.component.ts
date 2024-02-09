import { ComponentType } from '@angular/cdk/portal';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ComponentOutValue } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-commission-filter',
  templateUrl: './commission-filter.component.html',
  styleUrls: ['./commission-filter.component.scss'],
})
export class CommissionFilterComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Output('CommissionFilterComponent') CommissionFilterComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  filterForm: UntypedFormGroup;
  filterVal: string = '';
  filterList: any[] = [
    { id: 'all', text: 'all' },
    { id: 'paidDate', text: 'paid_date' },
    { id: 'pending', text: 'pending' },
    { id: 'suspended', text: 'suspended' },
    { id: 'tagged', text: 'tagged' },
    { id: 'voided', text: 'voided' },
  ];

  pendingList: any[] = [
    { id: 'all', text: 'all' },
    { id: 'readyPayment', text: 'ready_payment' },
    { id: 'unpaidInvoice', text: 'unpaid_payment' },
  ];
  pendingVal: string = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private modalCtrl: ModalController,
  ) {
    this.filterForm = this.formBuilder.group({

    });
  }

  ngOnInit() {

  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  setFilter() {
    this.modalCtrl.dismiss({ filter: this.filterVal });
  }

}
