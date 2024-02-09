import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DatatableAction, PermissionType, Permission } from 'src/app/Shared/models';
import { Paging } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { AlertService } from 'src/services/alert-service.service';
import { GlobalService } from 'src/services/global-service.service';
import { DialogComponent } from 'src/app/Shared/components';
import { ServiceNovationsService } from '../../services';
import { ServiceNoavtion } from '../../models';
import { ServiceNovationsNewComponent } from '../service-novations-new/service-novations-new.component';
import { ServiceNovationsReverseComponent } from '../service-novations-reverse/service-novations-reverse.component';

@Component({
  selector: 'app-service-novations-list',
  templateUrl: './service-novations-list.component.html',
  styleUrls: ['./service-novations-list.component.scss'],
})
export class ServiceNovationsListComponent implements OnChanges, OnDestroy {
  @Input() ServiceReference: string = '';

  @Output('ServiceNovationsListComponent') public ServiceNovationsListComponent: EventEmitter<string> = new EventEmitter<string>();

  totalCount: number;
  dataSource: ServiceNoavtion[] = [];
  dataTableAction: DatatableAction = { row: ['Details'], toolBar: ['Create', 'Refresh', 'ExportExcel', 'ReverseRecentOne'] };
  permissions: PermissionType[] = [];
  csvFileName = '';
  columns = ['FromAccountCode', 'ToAccountCode', 'NovationDateTime', 'FromServiceReference', 'ToServiceReference'];

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private loading: LoadingService,
    private serviceNovationsService: ServiceNovationsService,
    private alertService: AlertService,
    private dialog: MatDialog,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ServiceReference?.currentValue) {
      this.csvFileName = this.tranService.instant('ServiceNovations') + this.ServiceReference;
      this.getPermission();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  fetchData(event: Paging): void {
    this.getServiceNovationsList();
  }

  onReverseRecentOne(): void {
    this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '390px',
      panelClass: 'dialog',
      data: {
        component: ServiceNovationsReverseComponent,
        serviceReferenceId: this.ServiceReference,
      }
    })
  }
  
  viewDetail(event: ServiceNoavtion): void {}

  async addNew(): Promise<void> {
    this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '550px',
      panelClass: 'dialog',
      data: {
        component: ServiceNovationsNewComponent,
        serviceReferenceId: this.ServiceReference,
      }
    })
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Services/Novations', "").replace('/', "") as PermissionType);
  }

  private async getServiceNovationsList(): Promise<void> {
    await this.loading.present();
    this.serviceNovationsService.getServiceNovations(this.ServiceReference)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async result => {
          await this.loading.dismiss();
          this.dataSource = result;

          if(result?.some((item: ServiceNoavtion) => new Date(item.NovationDateTime) > new Date())){
            this.permissions.push('ReverseRecentOne');
          } else {
            if(this.permissions.includes('ReverseRecentOne')){
              this.permissions.filter((permission: PermissionType) => permission !== 'ReverseRecentOne')
            }
          }
        }, 
        error: async error => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        },
      });
  }

  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Services/Novations', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result: Permission[]) => {
          await this.loading.dismiss();
          this.formatPermissions(result);
          if (this.permissions.includes('')) {
            this.getServiceNovationsList();
          } else {
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.ServiceNovationsListComponent.emit('go-back');
            }, 1000);
          }
        },
        error: async error => {
          await this.loading.dismiss();
          const errResult = this.globService.ConvertKeysToLowerCase(error);
          this.tranService.errorMessage('resource_forbidden');
          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.ServiceNovationsListComponent.emit('go-back');
            }, 1000);
          }
        }
      });
  }
}
