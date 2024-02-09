import { Component, OnInit, Inject } from '@angular/core';
import { MatAlertService } from 'src/app/Shared/services/mat-alert.service';
import { SpinnerService } from 'src/app/Shared/services';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { Permission } from 'src/app/Shared/models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ExtensionItemDetail } from '../../models/contracts.types';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-extensions-form',
  templateUrl: './extensions-form.component.html',
  styleUrls: ['./extensions-form.component.scss'],
})
export class ExtensionsFormComponent implements OnInit {

  ExtensionData: ExtensionItemDetail;
  editMode: string = 'New';
  formGroup: UntypedFormGroup;
  showSpinner: boolean = false;
  minDate: Date;
  toDateFilter: any;

  constructor(
    private spinnerService: SpinnerService,
    private tranService: TranService,
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<ExtensionsFormComponent>,
    @Inject(MAT_DIALOG_DATA) private dlgData: {
      EditMode: string,
      ExtensionData?: ExtensionItemDetail,
    }
  ) {
    this.tranService.translaterService();
    this.formGroup = this.formBuilder.group({
      Id: ['', Validators.required],
      Name: ['', Validators.required],
      Discount: [0, Validators.required],
      Term: [0, Validators.required],
      Commission: [0, Validators.required],
      From: ['', Validators.required],
      To: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.dlgData?.ExtensionData) {
      this.ExtensionData = this.dlgData.ExtensionData;
    }
    if (this.dlgData?.EditMode) {
      this.editMode = this.dlgData.EditMode;
    }
    if (this.editMode == 'New') {
      this.getPermission('/Contracts/Extensions/New');
      this.minDate = null;
    } else {
      this.getPermission('/Contracts/Extensions/Update');

      this.formGroup.get('Id').setValue(this.ExtensionData.Id);
      this.formGroup.get('Name').setValue(this.ExtensionData.Name);
      this.formGroup.get('Discount').setValue(this.ExtensionData.Discount);
      this.formGroup.get('Term').setValue(this.ExtensionData.Term);
      this.formGroup.get('Commission').setValue(this.ExtensionData.Commission);
      this.formGroup.get('From').setValue(moment(this.ExtensionData.From));
      this.formGroup.get('To').setValue(moment(this.ExtensionData.To));
      this.minDate = new Date(this.ExtensionData.From);
    }
    this.setToDateFilter();
  }

  ngOnDestroy(): void {}

  public close(): void {
    this.dialogRef.close({message: 'close'});
  }

  onDateChange1(event: any) {
    this.minDate = new Date(event.target.value);
    this.setToDateFilter();
  }

  onDateChange2(event: MatDatepickerInputEvent<Date>) {
    this.minDate = event.value;
    this.setToDateFilter();
  }

  private setToDateFilter(): void{
    this.toDateFilter = (d: Date | null): boolean => {
      if (this.minDate === null){
        return false;
      }
      const setDate = d || new Date();
      return this.minDate < setDate;
    };
  }

  private async getPermission(url: string): Promise<void> {
    await this.spinnerService.loading();
    this.globService.getAuthorization(url)
      .subscribe({
        next: async (_result: Permission[]) => {
          await this.spinnerService.end();
          if (this.editMode === 'Update' && this.ExtensionData) {
          }
        },
        error: async (err) => {
          await this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorToastOnly('resource_forbidden');
          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            setTimeout(() => {
              this.close();
            }, 1000);
          }
        }
      });
  }

  saveExtension(): void {
    let reqData: ExtensionItemDetail = {
      Id: this.formGroup.get('Id').value,
      Name: this.formGroup.get('Name').value,
      Discount: this.formGroup.get('Discount').value,
      Term: this.formGroup.get('Term').value,
      Commission: this.formGroup.get('Commission').value,
      From: this.formGroup.get('From').value.format('YYYY-MM-DDTHH:MM:SS'),
      To: this.formGroup.get('To').value.format('YYYY-MM-DDTHH:MM:SS'),
      CreateBy: '',
      Created: null,
      UpdatedBy: '',
      LastUpdated: null,
    };
    if (this.editMode === 'Update' && this.ExtensionData.Id) {
      this.dialogRef.close({
        message: 'ok',
        data: reqData,
      });
    } else if (this.editMode === 'New') {
      this.dialogRef.close({
        message: 'ok',
        data: reqData,
      });
    }
  }
}
