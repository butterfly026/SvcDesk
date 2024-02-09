import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ChargeFormComponent } from './charge-form/charge-form.component';
import { ChargeDetailComponent } from './charge-detail/charge-detail.component';

@Component({
  selector: 'app-service-charges',
  templateUrl: './service-charges.component.html',
  styleUrls: ['./service-charges.component.scss'],
})
export class ServiceChargesComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() ServiceReference: string = '';
  @Input() ServiceId: string = '';
  @Input() ChargeType: string = '';
  @Input() ViewMode: string = 'list';
  @Input() Type: boolean = false;
  @Output('ChargesComponent') ChargesComponent: EventEmitter<string> = new EventEmitter<string>();


  chargeNewConfig = new MatDialogConfig();
  chargeUpdateConfig = new MatDialogConfig();
  chargeDetailConfig = new MatDialogConfig();

  chargeNewDialog: MatDialogRef<ChargeFormComponent, any> | undefined;
  chargeUpdateDialog: MatDialogRef<ChargeFormComponent, any> | undefined;
  chargeDetailDialog: MatDialogRef<ChargeDetailComponent, any> | undefined;

  ChargeId: string = '';
  ChargeDescription: string = '';
  isDetailReadOnly: boolean = false;

  constructor(public matDialog: MatDialog) { }

  ngOnInit() {
    if (this.ChargeType !== '') {
      this.ViewMode = this.ChargeType;
    }
  }

  openChargeFormModal(ChargeId) {
    this.chargeNewConfig.id = 'app-charge-new';
    this.chargeNewConfig.height = "700px";
    this.chargeNewConfig.width = "750px";
    this.chargeNewDialog = this.matDialog.open(ChargeFormComponent, this.chargeNewConfig);
    this.chargeNewDialog.componentInstance.ServiceReference = this.ServiceReference;    
    if (ChargeId) {
      this.chargeNewDialog.componentInstance.ChargeId = ChargeId;
      this.chargeNewDialog.componentInstance.ChargeType = "update";
    }
    this.chargeNewDialog.componentInstance.ChargeFormComponent.subscribe((event) => {
      this.processCharge(event);
      this.closeChargeNewModal();
    })
  }
  closeChargeNewModal() {
    this.chargeNewDialog.close();
  }

  openChargeUpdateModal() {
    this.chargeUpdateConfig.id = 'app-charge-update';
    this.chargeUpdateConfig.height = "700px";
    this.chargeUpdateConfig.width = "750px";
    this.chargeUpdateDialog = this.matDialog.open(ChargeFormComponent, this.chargeUpdateConfig);    
    this.chargeUpdateDialog.componentInstance.ChargeId = this.ChargeId;
    this.chargeUpdateDialog.componentInstance.ChargeType = 'update';
    this.chargeUpdateDialog.componentInstance.Title = `[${this.ChargeId} - ${this.ChargeDescription}]`;
    this.chargeUpdateDialog.componentInstance.ReadOnly = this.isDetailReadOnly;
    this.chargeUpdateDialog.componentInstance.ChargeFormComponent.subscribe((event) => {
      this.processCharge(event);
      this.closeChargeUpdateModal();

    });
  }
  closeChargeUpdateModal() {
    this.chargeUpdateDialog.close();
  }


  openChargeInstancesModal() {
    this.chargeDetailConfig.id = 'app-charge-detail';
    this.chargeDetailConfig.height = "700px";
    this.chargeDetailConfig.width = "850px";
    this.chargeDetailDialog = this.matDialog.open(ChargeDetailComponent, this.chargeDetailConfig);
    this.chargeDetailDialog.componentInstance.ChargeId = this.ChargeId;
    this.chargeDetailDialog.componentInstance.ChargeDescription = this.ChargeDescription;
    this.chargeDetailDialog.componentInstance.ChargeDetailComponent.subscribe((event) => {
      this.processCharge(event);
      this.closeChargeDetailModal();
    });
  }

  closeChargeDetailModal() {
    this.chargeDetailDialog.close();
  }


  processCharge(event) {
    if (this.ChargeType === '' || this.ChargeType === 'list') {
      if (typeof event == 'string') {
        if (event === 'close') {
          this.ChargesComponent.emit('close');
        } else if (event === 'create') {
          this.openChargeFormModal(null);
        } else if (event === 'list') {
          this.ViewMode = 'list';
        }
      } else if (typeof event == 'object') {
        if (event.name == 'chargeInstances') {
          this.ChargeId = event.ChargeId;
          this.ChargeDescription = event.ChargeDescription;
          this.openChargeInstancesModal();
        } else if (event.name == 'chargeUpdate') {
          this.ChargeId = event.ChargeId;
          this.ChargeDescription = event.ChargeDescription;
          this.isDetailReadOnly = false;
          this.openChargeUpdateModal();
        } else if (event.name == 'chargeDetail') {
          this.ChargeId = event.ChargeId;
          this.ChargeDescription = event.ChargeDescription;
          this.isDetailReadOnly = true;
          this.openChargeUpdateModal();
        }
      }
    } else {
      this.ChargesComponent.emit(event);
    }
  }

}
