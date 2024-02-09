import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LoadingService, ToastService, TranService } from 'src/services';
import { UUID } from 'angular2-uuid';
import { ComponentOutValue } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-un-tag-commission',
  templateUrl: './un-tag-commission.component.html',
  styleUrls: ['./un-tag-commission.component.scss'],
})
export class UnTagCommissionComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() CommissionDetail: any;

  @Output('UnTagCommissionComponent') UnTagCommissionComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  public dealerSelection: string = 'one_dealer';
  unTagCommissionForm: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private tranService: TranService,
    private loading: LoadingService,
    public globService: GlobalService,
  ) {

    this.tranService.translaterService();

    this.unTagCommissionForm = this.fb.group({
      dealer_id: ['', Validators.required],
      dealer_name: ['', Validators.required]
    });
  }


  ngOnInit(): void {
  }


  public saveForm = (): void => {

    const id = UUID.UUID();
    // this.loading.present();
    this.goBack();
  };

  goBack() {
    this.UnTagCommissionComponent.emit({ type: 'close', data: null });
  }


  public _dealerSelection = (value: string): void => {

    this.dealerSelection = value;

    // tslint:disable-next-line:forin
    for (const control in this.unTagCommissionForm.controls) {
      value === 'all_dealer' ? this.unTagCommissionForm.get(control).disable() :
        this.unTagCommissionForm.get(control).enable();
    }
  };


  private _translateText = (text) =>
    this.tranService.convertText(text)
      .toPromise();

}
