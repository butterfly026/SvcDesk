import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ComponentOutValue } from 'src/app/model';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { DepositStatusFormService } from './services/deposit-for.service';

@Component({
  selector: 'app-deposit-status-form',
  templateUrl: './deposit-status-form.component.html',
  styleUrls: ['./deposit-status-form.component.scss'],
})
export class DepositStatusFormComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() Id: string = '';

  @Output('DepositStatusFormComponent') DepositStatusFormComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  depositStatusForm: UntypedFormGroup;

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private formBuilder: UntypedFormBuilder,
    public globService: GlobalService,
    private depositService: DepositStatusFormService,
  ) {
    this.depositStatusForm = this.formBuilder.group({
      Reason: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.Id !== '') {
      this.getTaskGroupDetail();
    }
  }

  async getTaskGroupDetail() {
    await this.loading.present();
    this.depositService.getDepositStatusDetail(this.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      this.depositStatusForm.get('Reason').setValue(convResult?.reason);
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitForm() {
    if (this.depositStatusForm.valid) {
      if (this.Id) {
        this.updateTaskGroup();
      } else {
        this.createTaskGroup();
      }
    }
  }

  async createTaskGroup() {
    await this.loading.present();
    const reqBody = {
      Reason: this.depositStatusForm.get('Name').value,
    }
    this.depositService.createDepositStatus(reqBody).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.DepositStatusFormComponent.emit({ type: 'list' });
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  async updateTaskGroup() {
    const reqBody = {
      Reason: this.depositStatusForm.get('Name').value,
    }
    await this.loading.present();
    this.depositService.updateDepositStatus(reqBody, this.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.DepositStatusFormComponent.emit({ type: 'list' });
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  submitTrigger() {
    document.getElementById('accountdepositStatusFormSubmitButton').click();
  }

  goBack() {
    this.DepositStatusFormComponent.emit({ type: 'list' });
  }

  get f() {
    return this.depositStatusForm.controls;
  }

}
