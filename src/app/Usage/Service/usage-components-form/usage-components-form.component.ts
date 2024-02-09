import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { UsageHistoryService } from '../usage-history/services/usage-history.service';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { DatatableAction, PermissionType } from 'src/app/Shared/models';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SourceFileData } from 'src/app/Usage/models';

@Component({
  selector: 'app-usage-components-form',
  templateUrl: './usage-components-form.component.html',
  styleUrls: ['./usage-components-form.component.scss'],
})
export class UsageComponentsFormComponent implements OnInit {
  UsageId: number;
  columns: string[] = [
    'Id',
    'Name',
    'Type',
    'Amount',
    'DiscountId',
    'Discount',
    'DiscountType',
    'TransactionCategory',
    'Tariff',
    'PlanId',
    'Plan',
    'OverrideId',
    'Taxable'
  ];
  columnsSourceFileData: string[] = [
    'Column',
    'Value'
  ];
  dataTariffSource: any[] = [];
  dataSourceFileData: SourceFileData[];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh'] };
  columnsUsedForCurrency: string[] = ['Amount'];
  permissions: PermissionType[] = [];
  selectedIndex = 0;
  formGroup: UntypedFormGroup;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private loading: LoadingService,
    private tranService: TranService,
    private usageHistoryService: UsageHistoryService,
    public globService: GlobalService,
    private dialogRef: MatDialogRef<UsageComponentsFormComponent>,
    private cdr: ChangeDetectorRef,
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) private dlgData: {
      UsageId: number,
    }
  ) {
    this.tranService.translaterService();
    this.formGroup = this.formBuilder.group({
      Id: [0],
      Sequence: [0],
      CustomerName: [''],
      Type: [''],
      Status: [''],
      Name: [''],
      Date: [''],
      CreatedBy: [''],
      Created: [''],
      UpdatedBy: [''],
      LastUpdated: [''],
    });
  }

  ngOnInit() {
    if (this.dlgData?.UsageId) {
      this.UsageId = this.dlgData.UsageId;
    }
    this.getUsageComponentsList();
    this.getSourceFile();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  fetchTariffData(): void {
    this.getUsageComponentsList();
  }

  fetchNetworkData(): void {
    this.getSourceFile();
  }

  async getUsageComponentsList(){
    await this.loading.present();
    this.usageHistoryService.usageDetailList(this.UsageId)
    .pipe(takeUntil(this.unsubscribeAll$))
    .subscribe({
      next: async (result) => {
        await this.loading.dismiss();
        if (result === null) {
          this.tranService.errorMessage('');
        } else {
          this.dataTariffSource = result;
        }
      },
      error: async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      }
    });
  }

  async getSourceFile(){
    await this.loading.present();
    this.usageHistoryService.getSourceFile(this.UsageId)
    .pipe(takeUntil(this.unsubscribeAll$))
    .subscribe({
      next: async (result) => {
        await this.loading.dismiss();
        if (result === null) {
          this.tranService.errorMessage('');
        } else {
          this.formGroup.get('Id').setValue(result.Id);
          this.formGroup.get('Sequence').setValue(result.Sequence);
          this.formGroup.get('CustomerName').setValue(result.CustomerName);
          this.formGroup.get('Type').setValue(result.Type);
          this.formGroup.get('Status').setValue(result.Status);
          this.formGroup.get('Name').setValue(result.Name);
          this.formGroup.get('Date').setValue(result.Date);
          this.formGroup.get('CreatedBy').setValue(result.CreatedBy);
          this.formGroup.get('Created').setValue(result.Created);
          this.formGroup.get('UpdatedBy').setValue(result.UpdatedBy);
          this.formGroup.get('LastUpdated').setValue(result.LastUpdated);
          this.formGroup.get('Id').disable();
          this.formGroup.get('Sequence').disable();
          this.formGroup.get('CustomerName').disable();
          this.formGroup.get('Type').disable();
          this.formGroup.get('Status').disable();
          this.formGroup.get('Name').disable();
          this.formGroup.get('Date').disable();
          this.formGroup.get('CreatedBy').disable();
          this.formGroup.get('Created').disable();
          this.formGroup.get('UpdatedBy').disable();
          this.formGroup.get('LastUpdated').disable();
          this.dataSourceFileData = result.SourceData;
        }
      },
      error: async (error: any) => {
        await this.loading.dismiss();
        this.tranService.errorMessage(error);
      }
    });
  }

  public close(): void {
    this.dialogRef.close();
  }

  selectTabs(event) {
    this.selectedIndex = event.index;
    this.cdr.detectChanges();
  }
}
