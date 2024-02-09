import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DatatableRowAction, DatatableRowActionButton, PermissionType } from 'src/app/Shared/models';

@Component({
  selector: 'app-datatable-row-action',
  templateUrl: './datatable-row-action.component.html',
  styleUrls: ['./datatable-row-action.component.scss'],
})
export class DatatableRowActionComponent {

  @Input() actions: DatatableRowAction[] = [];
  @Input() permissions: PermissionType[] = [];
  @Input() revokedRowActionPermissions: PermissionType[] = [];
  @Input() countOfRowActionButtonsToShow: number = 3;
  @Input() isContextMenu: boolean = false;

  @Output() onEvent = new EventEmitter<DatatableRowAction>();

  actionButtons: DatatableRowActionButton[] = [
    { actionName: 'Details', toolTiop:'View', icon: 'eye-outline', permissions: ['Details']},
    { actionName: 'RowRefresh', toolTiop: 'Refresh', icon: 'refresh-outline', permissions: [] },
    { actionName: 'Update', toolTiop:'Edit', icon: 'create-outline', permissions: ['Update']},
    { actionName: 'Download', toolTiop:'Download', icon: 'download-outline', permissions: ['Download']},
    { actionName: 'History', toolTiop:'History', icon: 'timer-outline', permissions: ['']},
    { actionName: 'End', toolTiop:'End', icon: 'power-outline', permissions: ['']},
    { actionName: 'Services', toolTiop:'Services', icon: 'bicycle-outline', permissions: ['Services']},
    { actionName: 'Contacts', toolTiop:'Contacts', icon: 'business-outline', permissions: ['']},
    { actionName: 'Accounts', toolTiop:'Accounts', icon: 'people-outline', permissions: ['']},
    { actionName: 'Transactions', toolTiop:'Transactions', icon: 'receipt-outline', permissions: ['Transactions']},
    { actionName: 'UsageTransactions', toolTiop:'Transactions', icon: 'receipt-outline', permissions: ['UsageTransactions']},
    { actionName: 'Instances', toolTiop:'Instances', icon: 'dice-outline', permissions: ['']},
    { actionName: 'Definitions', toolTiop:'Definitions', icon: 'book-outline', permissions: ['']},
    { actionName: 'Profiles', toolTiop:'Profiles', icon: 'people-circle-outline', permissions: ['']},
    { actionName: 'Notes', toolTiop:'Notes', icon: 'documents-outline', permissions: ['']},
    { actionName: 'Status', toolTiop:'Status', icon: 'bar-chart-outline', permissions: ['']},
    { actionName: 'Reverse', toolTiop:'Reverse', icon: 'swap-horizontal-outline', permissions: ['']},
    { actionName: 'Disputes', toolTiop:'Disputes', icon: 'bonfire-outline', permissions: ['Disputes']},
    { actionName: 'Charges', toolTiop:'Charges', icon: 'wallet-outline', permissions: ['Charges']},
    { actionName: 'Message', toolTiop:'Message', icon: 'chatbubble-ellipses-outline', permissions: ['']},
    { actionName: 'RowEmail', toolTiop:'Email', icon: 'mail-outline', permissions: ['Emails']},
    { actionName: 'Suspend', toolTiop:'Suspend', icon: 'lock-closed-outline', permissions: ['']},
    { actionName: 'UnSuspend', toolTiop:'UnSuspend', icon: 'lock-open-outline', permissions: ['']},
    { actionName: 'Flag', toolTiop:'Flag', icon: 'flag-outline', permissions: ['']},
    { actionName: 'Schedules', toolTiop:'Schedules', icon: 'calendar-number-outline', permissions: ['']},    
    { actionName: 'RunSchedule', toolTiop:'RunSchedule', icon: 'alarm-outline', permissions: ['']},
    { actionName: 'RunNow', toolTiop:'RunNow', icon: 'play-outline', permissions: ['']},    
    { actionName: 'PDF', toolTiop: 'PDF', icon: 'document-text-outline', permissions: ['PDF'] },
    { actionName: 'Excel', toolTiop: 'Excel', icon: 'document-outline', permissions: ['Excel'] },
    { actionName: 'UpdateStatus', toolTiop: 'UpdateStatus', icon: 'notifications-outline', permissions: ['Status/Update'] },
    { actionName: 'Reallocate', toolTiop: 'Reallocate', icon: 'git-compare-outline', permissions: ['Allocations/Reallocate'] },
    { actionName: 'Delete', toolTiop:'Delete', icon: 'trash-outline', permissions: ['Delete']},
  ];

  checkPermission(value: PermissionType[]): boolean {
    return value.every((s) => this.permissions.includes(s) && !this.revokedRowActionPermissions.includes(s));
  }

  clickButton(value: DatatableRowAction): void {
    this.onEvent.emit(value);
  }
}
