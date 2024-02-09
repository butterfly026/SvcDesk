import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LoadingService, ToastService, TranService } from 'src/services';
import { UUID } from 'angular2-uuid';
import { ComponentOutValue } from 'src/app/model';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-tag-commission',
  templateUrl: './tag-commission.component.html',
  styleUrls: ['./tag-commission.component.scss'],
})
export class TagCommissionComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() CommissionDetail: any;

  @Output('TagCommissionComponent') TagCommissionComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  public dealerSelection: string = 'one_dealer';
  tagCommissionForm: UntypedFormGroup;


  constructor(private fb: UntypedFormBuilder,
    private tranService: TranService,
    private loading: LoadingService,
    public globService: GlobalService,
  ) {

    this.tranService.translaterService();

    this.tagCommissionForm = this.fb.group({
      dealer_id: ['', Validators.required],
      dealer_name: ['', Validators.required]
    });
  }


  ngOnInit(): void {
  }


  public saveForm = (): void => {

    const id = UUID.UUID();
    this.TagCommissionComponent.emit({ type: 'close', data: null });
  };

  goBack() {
    this.TagCommissionComponent.emit({ type: 'close', data: null });
  }

  public _dealerSelection = (value: string): void => {

    this.dealerSelection = value;

    // tslint:disable-next-line:forin
    for (const control in this.tagCommissionForm.controls) {
      value === 'all_dealer' ? this.tagCommissionForm.get(control).disable() :
        this.tagCommissionForm.get(control).enable();
    }
  };


  private _translateText = (text) =>
    this.tranService.convertText(text)
      .toPromise();


}
