import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ComponentOutValue, Paging } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ServiceAttributeListService } from './services/attribute-list.service';
import { MatDialog } from '@angular/material/dialog';
import { ServiceAttributeFormComponent } from '../service-attribute-form/service-attribute-form.component';
import { ServiceAttributeInstanceDetailsComponent } from '../service-attribute-instance-details/service-attribute-instance-details.component';
import { ServiceAttributeInstance } from '../../models/service-attribute-instance';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatatableAction, MessageForRowDeletion, Permission, PermissionType, SearchOption } from 'src/app/Shared/models';
import { AlertService } from 'src/services/alert-service.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AttributePaging } from '../service-attribute.types';
import { DialogComponent } from 'src/app/Shared/components';
import { SpinnerService } from 'src/app/Shared/services';

@Component({
  selector: 'app-service-attribute-list',
  templateUrl: './service-attribute-list.component.html',
  styleUrls: ['./service-attribute-list.component.scss'],
})
export class ServiceAttributeListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() ServiceReference: string = '';
  @Input() ServiceId: string = '';
  @Input() Refresh: Boolean = true;
  @Output('ServiceAttributeListComponent') ServiceAttributeListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  @ViewChild('myGridServiceAttributeList') myGridServiceAttributeList: jqxGridComponent;

  totalCount: number = 0;
  dataSource: ServiceAttributeInstance[] = [];
  columns: string[]
  dataTableAction: DatatableAction = { row: ['Details', 'Update', 'Delete'], toolBar: ['Create', 'Refresh', 'ExportExcel'] };
  pagingParam = new Paging();
  permissions: PermissionType[] = [];
  csvFileName: string;
  searchOptions: SearchOption[] = ['Text', 'Uninvoiced'];
  ShowSearchOption: boolean = false;
  groupForm: UntypedFormGroup;

  private modal: HTMLIonModalElement;
  private unsubscribeAll$: Subject<any> = new Subject<any>();
  private Refresh_: Boolean = true;

  deletionMsg: MessageForRowDeletion = {
    header: '',
    message: ''
  }

  constructor(
    private tranService: TranService,    
    public globService: GlobalService,
    private spinnerService: SpinnerService,
    private attService: ServiceAttributeListService,
    public dialog: MatDialog,
    private alertService: AlertService,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.configInitialValues();
    this.tranService.translaterService();
    this.groupForm = this.formBuilder.group({
      currentOnly: [false],
    });

    this.groupForm.get('currentOnly').valueChanges.subscribe((result: any) => {
      this.getAttributes();
    });
    this.tranService.convertText('are_you_sure').subscribe(value => {
      this.deletionMsg.header = value;
    });
    this.tranService.convertText('delete_confirm_service_attribute').subscribe(value => {
      this.deletionMsg.message = value;
    });
  }

  ngOnInit() {
    this.csvFileName = `Service Attributes ` + this.ServiceId;
    this.getPermission();
  }

  async ngOnChanges(): Promise<void> {
    if (this.Refresh !== undefined && this.Refresh !== this.Refresh_) {
      this.getAttributes()
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  async fetchData(event: Paging): Promise<void> {
    this.pagingParam = {
      CountRecords: 'Y',
      ...event
    }
    this.getAttributes();
  }

  async deleteSelectedRow(data: ServiceAttributeInstance): Promise<void> {
    await this.spinnerService.loading();
    this.attService.deleteAttribute(data.Id)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result) => {
          this.getAttributes()
        },
        error: async (err) => {
          await this.spinnerService.end();
          this.tranService.errorMessage(err);
        }
      });
  }

  async addNew(): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '400px',
      panelClass: 'dialog',
      data: {
        component: ServiceAttributeFormComponent,
        ServiceReference: this.ServiceReference,
        ServiceId: this.ServiceId,
      }
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res === 'ok') {
        this.getAttributes();
        this.Refresh = !this.Refresh;
      }
    })
  }

  async editOne(event: ServiceAttributeInstance): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '400px',
      panelClass: 'dialog',
      data: {
        component: ServiceAttributeFormComponent,
        ServiceReference: this.ServiceReference,
        EditMode: 'Update',
        Data: event,
        ServiceId: this.ServiceId,
      }
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res === 'ok') {
        this.getAttributes();
        this.Refresh = !this.Refresh;
      }
    })
  }

  viewDetail(event: ServiceAttributeInstance): void {
    this.dialog.open(ServiceAttributeInstanceDetailsComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '600px',
      maxHeight: '600px',
      data: event
    });
  }

  private configInitialValues(): void {
    this.columns = [
      'Id', 'DefinitionId', 'Name', 'Value', 'From', 'To', 'Editable', 'EventId', 'LastUpdated', 'UpdatedBy',
    ];
  }

  async getAttributes() {
    let curOnly = this.ShowSearchOption ? !(this.groupForm.get('currentOnly').value) : true;
    let reqData = {
      currentOnly: curOnly,
      ...this.pagingParam
    };
    await this.spinnerService.loading();
    this.attService.getAttributes(this.ServiceReference, reqData)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) => {
          await this.spinnerService.end();
          if (result === null) {
            this.tranService.errorMessage('no_events');
          } else {
            this.totalCount = result.Count;
            this.dataSource = result.Attributes.map(s => ({ ...s, RevokedRowActionPermissions: s.Editable ? null : 'Update' }));
          }
        },
        error: async (error: any) => {
          await this.spinnerService.end();
          this.tranService.errorMessage(error);
        }
      })
    this.Refresh_ = this.Refresh;
  }

  private async getPermission(): Promise<void> {
    await this.spinnerService.loading();
    this.globService.getAuthorization('/Services/Attributes', true)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (_result: Permission[]) => {
          this.formatPermissions(_result);
          await this.spinnerService.end();
          if (this.permissions.includes('')) {
            this.getAttributes();
          } else {
            await this.spinnerService.end();
            this.tranService.errorMessage('resource_forbidden');
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.ServiceAttributeListComponent.emit({ type: 'go-back' });
            }, 1000);
          }
        },
        error: async (err) => {
          await this.spinnerService.end();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            this.alertService.closeAllAlerts();
            setTimeout(() => {
              this.ServiceAttributeListComponent.emit({ type: 'go-back' });
            }, 1000);
          }
        }
      });
  }

  private formatPermissions(value: Permission[]): void {
    this.permissions = value.map(s => s.Resource.replace('/Services/Attributes', "").replace('/', "") as PermissionType);
  }

  showHideSearchOption(flag: boolean) {
    this.ShowSearchOption = flag;
  }

}
