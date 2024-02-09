import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { LoadingService, ToastService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

import { ServiceChargeOverrideService } from '../services/service.service';
import { DatatableAction, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { ChargeOverride } from '../../charge-overrides.types';
import { Paging } from 'src/app/model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/services/alert-service.service';
import { MatDialog } from '@angular/material/dialog';
import { ServiceFormComponent } from '../service-form/service-form.component';

@Component({
  selector: 'app-service-charge-override-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss'],
})
export class ServiceListComponent implements OnInit {
  @Input() ServiceReference: string = '';
  @Input() ServiceId: string = '';
  @Input() Refresh: Boolean = true;
  @Input() permissions: PermissionType[] = [];

  @Input() PagingParam: any;
  @Output('ServiceListComponent') ServiceListComponent: EventEmitter<string> = new EventEmitter<string>();

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

  constructor(
    private loading: LoadingService,
    private alertService: AlertService,
    private svcServiceOverride: ServiceChargeOverrideService,
    private tranService: TranService,
    
    private cdr: ChangeDetectorRef,
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
    private dialog: MatDialog,
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
    this.csvFileName = 'Service Charge Overrides - ' + this.ServiceId;
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
    this.permissions = value.map(s => s.Resource.replace('/Services/Charges/Overrides', "").replace('/', "") as PermissionType);
  }

  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Services/Charges/Overrides', true)
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
    this.svcServiceOverride.getChargeOverrides(this.eventParam, this.ServiceReference).subscribe(async (result: any) => {
      
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
    const dialogRef = this.dialog.open(ServiceFormComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '550px',
      data: {
        ServiceReference: this.ServiceReference,
        EditMode: 'Update',
        IsModal: true,
        Data: selectedData,
      },
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if(res == 'ok'){
        this.getChargeList();
      }
    })
  }

  onDetails(selectedData: ChargeOverride){
    const dialogRef = this.dialog.open(ServiceFormComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '550px',
      data: {
        ServiceReference: this.ServiceReference,
        EditMode: 'View',
        IsModal: true,
        Data: selectedData,
      },
    });

    dialogRef.afterClosed().subscribe(async (res) => {
    })
  }

  goToNew() {
    const dialogRef = this.dialog.open(ServiceFormComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '650px',
      maxHeight: '550px',
      data: {
        ServiceReference: this.ServiceReference,
        IsModal: true,
        EditMode: 'New',
      },
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if(res == 'ok'){
        this.getChargeList();
      }
    })
    // this.AccountListComponent.emit('new&' + 'data&' + this.pageRowNumber + '&' + this.rowStep + '&' + this.SkipRecords);
  }

  async onDelete(selectedData: ChargeOverride) {
    await this.loading.present();
    this.svcServiceOverride.deleteChargeOverrides(selectedData.Id).subscribe(async (result: any) => {
      await this.loading.dismiss();
      this.getChargeList();
    }, async (error: any) => {
      await this.loading.dismiss();
      this.tranService.errorMessage(error);
    });
  }

  goBack() {
    this.ServiceListComponent.emit('go-back');
  }

  async confirmEnd() {
    await this.loading.present();
    const RequestBody = {
      End: this.endForm.get('endDate').value,
    }
    this.svcServiceOverride.endChargeOverrides(this.selectedData.Id, this.globService.convertRequestBody(RequestBody)).subscribe(async (result: any) => {
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
