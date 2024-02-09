import { Component, OnInit, Inject } from '@angular/core';
import { MatAlertService } from 'src/app/Shared/services/mat-alert.service';
import { SpinnerService } from 'src/app/Shared/services';
import { LoadingService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { DatatableAction, MessageForRowDeletion, Permission, PermissionType } from 'src/app/Shared/models';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ContractItem, ContractItemDetail, DisconnectionUnit, ExtensionItemDetail, ExtensionItem, TermUnit } from '../../models/contracts.types';
import { ContractsService } from '../../services/contracts.service';
import { Paging } from 'src/app/model';
import { PenaltiesService } from 'src/app/Configuration/penalties/services/penalties.service';
import { PenaltyItemDetail } from 'src/app/Configuration/penalties/models/penalties.types';
import { ExtensionsFormComponent } from '../extensions-form/extensions-form.component';
import { DialogComponent } from 'src/app/Shared/components';

@Component({
  selector: 'app-contracts-form',
  templateUrl: './contracts-form.component.html',
  styleUrls: ['./contracts-form.component.scss'],
})
export class ContractsFormComponent implements OnInit {

  ContractData: ContractItemDetail;
  ContractId: string;
  editMode: string = 'New';
  formGroup: UntypedFormGroup;
  showSpinner: boolean = false;
  extensionsDataSource: ExtensionItemDetail[] = [];
  dataTableAction: DatatableAction = { row: ['Update', 'Delete'], toolBar: ['Create'] };
  eventParam = new Paging();
  permissions: PermissionType[] = [];
  tablepermissions: PermissionType[] = [];
  termUnitList: TermUnit[] = ['Month', 'Year'];
  disconnectionUnitList: DisconnectionUnit[] = ['Month', 'Year'];
  penaltiesList: PenaltyItemDetail[];
  columns: string[] = [
    "Id",
    "Name",
    "Discount",
    "Term",
    "Commission",
    "From",
    "To",
  ];

  deletionMsg: MessageForRowDeletion = {
    header: this.tranService.instant('are_you_sure'),
    message: this.tranService.instant('are_you_sure_delete_extension'),
  }

  constructor(
    public dialog: MatDialog,
    private loading: LoadingService,
    private spinnerService: SpinnerService,
    private contractsService: ContractsService,
    private penaltiesService: PenaltiesService,
    private tranService: TranService,
    private matAlert: MatAlertService,
    public globService: GlobalService,
    private formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<ContractsFormComponent>,
    @Inject(MAT_DIALOG_DATA) private dlgData: {
      EditMode: string,
      ContractId?: string,
    }
  ) {
    this.tranService.translaterService();
    this.formGroup = this.formBuilder.group({
      Id: ['', Validators.required],
      Name: ['', Validators.required],
      Term: [0, Validators.required],
      TermUnit: ['', Validators.required],
      Disconnection: [0, Validators.required],
      DisconnectionUnit: ['', Validators.required],
      DisconnectionFee: [0, Validators.required],
      PenaltyId: ['', Validators.required],
      PenaltyPercentage: [0, Validators.required],
      CoolOffDays: [0, Validators.required],
      Contact: [true, Validators.required],
      Service: [true, Validators.required],
    });
  }

  ngOnInit(): void{
    if (this.dlgData?.ContractId) {
      this.ContractId = this.dlgData.ContractId;
    }
    if (this.dlgData?.EditMode) {
      this.editMode = this.dlgData.EditMode;
    }
    this.getExtensionPermission();
    if (this.editMode == 'New') {
      this.getPermission('/Contracts/New');
    } else {
      if (this.editMode == 'View') {
        this.dataTableAction =  { row: [], toolBar: [] };
        this.getPermission('/Contracts/Details');
      } else {
        this.getPermission('/Contracts/Update');
      }
    }
    this.getPenaltiesList();
  }

  ngOnDestroy(): void {}

  private formatExtensionPermissions(value: Permission[]): void {
    this.tablepermissions = value.map(s => s.Resource.replace('/Contracts/Extensions', "").replace('/', "") as PermissionType);
  }

  private async getExtensionPermission(): Promise<void> {
    await this.spinnerService.loading();
    this.globService.getAuthorization('/Contracts/Extensions', true)
      .subscribe({
        next: async (_result: Permission[]) => {
          await this.spinnerService.end();
          this.formatExtensionPermissions(_result);
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

  private async getPermission(url: string): Promise<void> {
    await this.spinnerService.loading();
    this.globService.getAuthorization(url)
      .subscribe({
        next: async (_result: Permission[]) => {
          await this.spinnerService.end();
          if ((this.editMode === 'Update' || this.editMode === 'View') && this.ContractId) {
            this.getContractDetail(this.ContractId);
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

  private async getContractDetail(ContractId: string): Promise<void> {
    await this.spinnerService.loading();
    this.contractsService.getContractDetail(ContractId)
      .subscribe({
        next: async (result: ContractItemDetail) => {
          this.spinnerService.end();
          this.formGroup.get('Id').setValue(result.Id);
          this.formGroup.get('Name').setValue(result.Name);
          this.formGroup.get('Term').setValue(result.Term);
          this.formGroup.get('TermUnit').setValue(result.TermUnit);
          this.formGroup.get('Disconnection').setValue(result.Disconnection);
          this.formGroup.get('DisconnectionUnit').setValue(result.DisconnectionUnit);
          this.formGroup.get('DisconnectionFee').setValue(result.DisconnectionFee);
          this.formGroup.get('PenaltyId').setValue(result.PenaltyId);
          this.formGroup.get('PenaltyPercentage').setValue(result.PenaltyPercentage);
          this.formGroup.get('CoolOffDays').setValue(result.CoolOffDays);
          this.formGroup.get('Contact').setValue(result.Contact);
          this.formGroup.get('Service').setValue(result.Service);
          this.extensionsDataSource = result.Extensions;
          if(this.editMode == 'View'){
            this.formGroup.get('Id').disable();
            this.formGroup.get('Name').disable();
            this.formGroup.get('Term').disable();
            this.formGroup.get('TermUnit').disable();
            this.formGroup.get('Disconnection').disable();
            this.formGroup.get('DisconnectionUnit').disable();
            this.formGroup.get('DisconnectionFee').disable();
            this.formGroup.get('PenaltyId').disable();
            this.formGroup.get('PenaltyPercentage').disable();
            this.formGroup.get('CoolOffDays').disable();
            this.formGroup.get('Contact').disable();
            this.formGroup.get('Service').disable();
          }
        },
        error: async (error: any) => {
          this.spinnerService.end();
          this.tranService.matErrorMessage(error, (title, button, content) => {            
          });
        }
      });
  }

  async saveContract(): Promise<void> {
    let tempExtensions: ExtensionItem[] = this.extensionsDataSource.map((row) => {
      return {
        Id: row.Id,
        Name: row.Name,
        Discount: row.Discount,
        Term: row.Term,
        Commission: row.Commission,
        From: row.From,
        To: row.To,
      } as ExtensionItem;
    });
    let reqData: ContractItem = {
      Id: this.formGroup.get('Id').value,
      Name: this.formGroup.get('Name').value,
      Term: this.formGroup.get('Term').value,
      TermUnit: this.formGroup.get('TermUnit').value,
      Disconnection: this.formGroup.get('Disconnection').value,
      DisconnectionUnit: this.formGroup.get('DisconnectionUnit').value,
      DisconnectionFee: this.formGroup.get('DisconnectionFee').value,
      PenaltyId: this.formGroup.get('PenaltyId').value,
      PenaltyPercentage: this.formGroup.get('PenaltyPercentage').value,
      CoolOffDays: this.formGroup.get('CoolOffDays').value,
      Contact: this.formGroup.get('Contact').value,
      Service: this.formGroup.get('Service').value,
      Extensions: tempExtensions,
    };
    let reqFormBody: any = this.globService.convertRequestBody(reqData);

    await this.spinnerService.loading();
    if (this.editMode === 'Update' && this.ContractId) {
      this.contractsService.createContract(reqFormBody)
        .subscribe({
          next: async (result) => {
            this.spinnerService.end();
            this.dialogRef.close('ok');
          },
          error: async (error: any) => {
            this.spinnerService.end();
            this.tranService.matErrorMessage(error, (title, button, content) => {            
            });
          }
        });
    } else if (this.editMode === 'New') {
      this.contractsService.createContract(reqFormBody)
        .subscribe({
          next: async (result) => {
            this.spinnerService.end();
            this.dialogRef.close('ok');
          },
          error: async (error: any) => {
            this.spinnerService.end();
            this.tranService.matErrorMessage(error, (title, button, content) => {            
            });
          }
        });
    }
  }

  public close(): void {
    this.dialogRef.close('cancel');
  }

  private async getPenaltiesList(): Promise<void> {
    await this.spinnerService.loading();
    this.penaltiesService.getPenaltiesList()
      .subscribe({
        next: async (result: PenaltyItemDetail[]) => {
          this.spinnerService.end();
          this.penaltiesList = result;
        },
        error: async (error: any) => {
          this.spinnerService.end();
          this.tranService.matErrorMessage(error, (title, button, content) => {            
          });
        }
      });
  }

  async addNew(): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '550px',
      maxHeight: '550px',
      panelClass: 'dialog',
      data: {
        component: ExtensionsFormComponent,
        EditMode: 'New',
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res?.message && res.message === 'ok') {
        let testData: ExtensionItemDetail[] = this.extensionsDataSource.filter(row => {
          return row.Id === res.data.Id;
        });
        if (testData.length === 0){
          this.extensionsDataSource = [...this.extensionsDataSource, res.data];
        } else {
          this.tranService.errorToastOnly('existing_id');
        }
      }
    });
  }

  async editOne(event: ExtensionItemDetail): Promise<void> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '100%',
      height: '100%',
      maxWidth: '550px',
      maxHeight: '550px',
      panelClass: 'dialog',
      data: {
        component: ExtensionsFormComponent,
        EditMode: 'Update',
        ExtensionData: event,
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res?.message && res.message === 'ok') {
        this.extensionsDataSource = this.extensionsDataSource.map(row => {
          if (row.Id === res.data.Id) {
            return res.data;
          } else {
            return row;
          }
        });
      }
    });
  }

  async deleteItem(event: ExtensionItemDetail): Promise<void> {
    await this.loading.present();
    this.extensionsDataSource = this.extensionsDataSource.filter(row => {
      return row.Id !== event.Id;
    })
  }
}
