import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DatatableToolBarAction, DatatableToolBarActionButton, PermissionType } from 'src/app/Shared/models';

@Component({
  selector: 'app-datatable-toolbar',
  templateUrl: './datatable-toolbar.component.html',
  styleUrls: ['./datatable-toolbar.component.scss'],
})
export class DatatableToolbarComponent implements OnChanges {

  @Input() showSearchOptions: boolean = false;
  @Input() actions: DatatableToolBarAction[] = [];
  @Input() permissions: PermissionType[] = [];
  @Input() countOfToolBarActionButtonsToShow: number = 4;

  @Output() onToggleSearchOptions = new EventEmitter<boolean>();
  @Output() onEvent = new EventEmitter<DatatableToolBarAction>();

  searchOptionsExpanded: boolean = false;
  actionButtons: DatatableToolBarActionButton[] = [
    { actionName: 'Create', toolTiop:'New', icon: 'add-outline', permissions: ['New']},
    { actionName: 'Refresh', toolTiop:'RefreshTable', icon: 'refresh-outline', permissions: []},
    { actionName: 'ExportExcel', toolTiop:'ExportExcel', icon: 'download-outline', permissions: []},
    { actionName: 'Receipt', toolTiop:'Receipt', icon: 'cash-outline', permissions: []},
    { actionName: 'CreditAdjustment', toolTiop:'CreditAdjustment', icon: 'receipt-outline', permissions: []},
    { actionName: 'Invoice', toolTiop:'Invoice', icon: 'reader-outline', permissions: []},
    { actionName: 'Refund', toolTiop:'Refund', icon: 'arrow-undo-outline', permissions: []},
    { actionName: 'DebitNote', toolTiop:'DebitNote', icon: 'wallet-outline', permissions: []},
    { actionName: 'CreditNote', toolTiop:'CreditNote', icon: 'color-wand-outline', permissions: []},
    { actionName: 'DebitAdjustment', toolTiop:'DebitAdjustment', icon: 'sparkles-outline', permissions: []},
    { actionName: 'SMS', toolTiop:'SMS', icon: 'chatbubble-ellipses-outline', permissions: []},
    { actionName: 'Email', toolTiop:'Email', icon: 'mail-outline', permissions: []},
    { actionName: 'ReverseRecentOne', toolTiop: 'ReverseRecentOne', icon: 'arrow-undo-outline', permissions: ['ReverseRecentOne']}
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.actions?.currentValue) {
      this.actionButtons = this.actionButtons.filter(s => changes.actions.currentValue.includes(s.actionName));
    }
  }

  checkPermission(value: PermissionType[]): boolean {
    return value.every((s) => this.permissions.includes(s));
  }

  clickButton(value: DatatableToolBarAction): void {
    this.onEvent.emit(value);
  }

  toggleSearchOptions(): void {
    this.searchOptionsExpanded = !this.searchOptionsExpanded;
    this.onToggleSearchOptions.emit(this.searchOptionsExpanded);
  }

}
