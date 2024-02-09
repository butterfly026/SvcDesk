import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { LoadingService, ToastService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { AccountService } from '../services/account-service';
import { DatatableAction, MessageForRowDeletion, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { ChargeOverride } from '../../charge-overrides.types';
import { Paging } from 'src/app/model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/services/alert-service.service';
import { MatDialog } from '@angular/material/dialog';
import { AccountChargeOverrideFormComponent } from '../account-charge-override-form/account-charge-override-form.component';
import { DialogComponent } from 'src/app/Shared/components';

@Component({
  selector: 'app-account-charge-override-list',
  templateUrl: './account-charge-override-list.component.html',
  styleUrls: ['./account-charge-override-list.component.scss'],
})
export class AccountChargeOverrideListComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() Refresh: Boolean = true;
  @Input() permissions: PermissionType[] = [];
  @Output('AccountListComponent') AccountListComponent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('endDialog') endDialog: TemplateRef<any>;

  dataSource: ChargeOverride[] = [];
  totalCount: number;
  expandServiceList = [];
  columns: string[] = [];
  dataTableAction: DatatableAction = { row: ['Details', 'End', 'Delete'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };
  columnsUsedForCurrency: string[] = ['Price', ''];
  _showSearchOption: boolean = false;
  searchOptions: SearchOption[] = ['Text'];

  eventParam = new Paging();


  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private Refresh_: Boolean = true;
  csvFileName: string = '';
  
  deleteStr = '';
  deleteMessage: string = '';
  disableUpdate = false;
  selectedData: ChargeOverride = null;

  endForm: UntypedFormGroup;
  endFormMinDate: any;
  
  deletionMsg: MessageForRowDeletion = {
    header: this.tranService.instant('are_you_sure'),
    message: this.tranService.instant('are_you_sure_delete_charge_override'),
  }


  constructor(
    private loading: LoadingService,
    private toast: ToastService,
    private accountService: AccountService,
    private tranService: TranService,
    private alertService: AlertService,
    private dialog: MatDialog,
    
    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.tranService.translaterService();

    this.endForm = this.formBuilder.group({
      endDate: ['', Validators.required]
    });
    this.configInitialValues();
  }
  private configInitialValues(): void {
    this.columns = [
      'Id',
      'Type',
      'Charge',
      'Price',
      'MarkUp',
      'From',
      'To',
      'Plan',
      'PlanOption',
      'PlanId',
      'PlanOptionId',
      'ServiceId',
      'ServiceReference',
      'ChargeOverrideDescription',
      'ChargeDefinitionId',
      'Billed',
      'TerminateOnPlanChange',
      'UpdatedBy',
      'LastUpdated',
      'CreatedBy',
      'Created',
    ];
  }

  ngOnInit() { 
    this.csvFileName = 'Account Charge Overrides - ' + this.ContactCode;
    this.getPermission();
  }

  ngOnChanges(): void {
    if (this.Refresh !== undefined && this.Refresh !== this.Refresh_) {
      this.getChargeList()
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  fetchData(event: Paging): void {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getChargeList();
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Accounts/Charges/Overrides', "").replace('/', "") as PermissionType);
  }

  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Accounts/Charges/Overrides', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result) => {
          await this.loading.dismiss();
          this.formatPermissions(_result);
          if (this.permissions.includes('')) {
            this.getChargeList();
          } else {
            await this.loading.dismiss();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.goBack();
            }, 1000);
          }
        },
        error: async (err) => {
          await this.loading.dismiss();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.goBack();
            }, 1000);
          }
        }
      });
  }
  async getChargeList() {
    this.dataSource = [];
    await this.loading.present();
    this.accountService.getChargeOverrides(this.eventParam, this.ContactCode).subscribe(async (result: any) => {
      
      await this.loading.dismiss();
      const convResult = this.globService.ConvertKeysToLowerCase(result);
      if (result === null) {
        this.tranService.errorMessage('no_charges');
      } else {
        this.dataSource = result.Overrides;
        this.totalCount = result.Count;
      }
    }, async (error: any) => {
      await this.loading.dismiss();
      
      this.tranService.errorMessage(error);
    });

  }


  async endCharge(selectedData: ChargeOverride) {
    this.deleteStr = 'end';
    this.endForm.get('endDate').reset();
    this.selectedData = selectedData;
    this.dialog.open(this.endDialog);
    this.endFormMinDate = this.globService.getDateTimeWithString('YYYY-MM-DDTHH:mm', this.selectedData.From);
  }

  goToUpdate(selectedData: ChargeOverride) {
    
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '550px',
      panelClass: 'dialog',
      data: {
        component: AccountChargeOverrideFormComponent,
        ContactCode: this.ContactCode,
        EditMode: 'Update',
        IsModal: true,
        Data: selectedData,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res == 'ok'){
        this.getChargeList();
      }
    });
  }

  onDetails(selectedData: ChargeOverride){
    
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '550px',
      panelClass: 'dialog',
      data: {
        component: AccountChargeOverrideFormComponent,
        ContactCode: this.ContactCode,
        EditMode: 'View',
        IsModal: true,
        Data: selectedData,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
    });

  }

  goToNew() {
    
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '550px',
      panelClass: 'dialog',
      data: {
        component: AccountChargeOverrideFormComponent,
        ContactCode: this.ContactCode,
        IsModal: true,
        EditMode: 'New',
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if(res == 'ok'){
        this.getChargeList();
      }
    });
    // this.AccountListComponent.emit('new&' + 'data&' + this.pageRowNumber + '&' + this.rowStep + '&' + this.SkipRecords);
  }

  async onDelete(selectedData: ChargeOverride) {
    await this.loading.present();
    this.accountService.deleteChargeOverrides(selectedData.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.getChargeList();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  goBack() {
    this.AccountListComponent.emit('go-back');
  }

  async confirmEnd() {
    await this.loading.present();
    const RequestBody = {
      End: this.endForm.get('endDate').value,
    }
    this.accountService.endChargeOverrides(this.selectedData.Id, this.globService.convertRequestBody(RequestBody)).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.cancelEnd();
      this.getChargeList();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });

    await this.loading.dismiss();
  }

  cancelEnd() {
    this.deleteStr = '';
  }

}
