import { Component, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { takeUntil } from 'rxjs/operators';
import { Subject, merge } from 'rxjs';
import * as XLSX from 'xlsx';

import { Paging } from 'src/app/model';
import { TranService } from 'src/services';
import { DatatableAction, DatatableRowAction, DatatableToolBarAction, MessageForRowDeletion, FetchEmitEvent, PermissionType, SearchOption } from 'src/app/Shared/models';
import { DatatableService } from '../../services/datatable.service';
import { MatAlertComponent } from '..';
import { SpinnerService } from '../../services';


@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class DatatableComponent implements OnChanges, AfterViewInit, OnDestroy {

  @Input() totalCount: number = 0;
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Input() subTableColumns: string[] = [];
  @Input() columnsUsedForCurrency: string[] = [];
  @Input() columnsUsedForWrap: string[] = ['Note'];
  @Input() columnsUsedForDecimal: string[] = [];
  @Input() columnsUsedForDate: string[] = [];
  @Input() subTableColumnsUsedForCurrency: string[] = [];
  @Input() subTableColumnsUsedForWrap: string[] = ['Note'];
  @Input() subTableColumnsUsedForDecimal: string[] = [];
  @Input() subTableColumnsUsedForDate: string[] = [];
  @Input() subTableAction: DatatableAction = { row: [], toolBar: [] };
  @Input() action: DatatableAction;
  @Input() permissions: PermissionType[] = [];
  @Input() searchOptions: SearchOption[] = []
  @Input() csvFileName: string;
  @Input() allowDblClickRow: boolean;
  @Input() usePagination: boolean = true;
  @Input() countOfRowActionButtonsToShow: number = 3;
  @Input() countOfToolBarActionButtonsToShow: number = 4;
  @Input() propertyNameToShowInSubTable: string;
  @Input() messageForRowDeletion: MessageForRowDeletion;
  @Input() pageSizeOptions: number[] = [10, 20, 50];

  @Output() onFetchData = new EventEmitter<FetchEmitEvent>();

  // Outputs for ToolbarActionEvent
  @Output() onToggleSearchOptions = new EventEmitter<boolean>();
  @Output() onCreate = new EventEmitter<void>();
  @Output() onReceipt = new EventEmitter<void>();
  @Output() onInvoice = new EventEmitter<void>();
  @Output() onCreditNote = new EventEmitter<void>();
  @Output() onRefund = new EventEmitter<void>();
  @Output() onDebitNote = new EventEmitter<void>();
  @Output() onCreditAdjustment = new EventEmitter<void>();
  @Output() onDebitAdjustment = new EventEmitter<void>();
  @Output() onEmail = new EventEmitter<void>();
  @Output() onSMS = new EventEmitter<void>();
  @Output() onReverseRecentOne = new EventEmitter<void>();
  
  // Outputs for RowActionEvent
  @Output() onDelete = new EventEmitter<any>();
  @Output() onView = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onHistory = new EventEmitter<any>();
  @Output() onDoublClickRow = new EventEmitter<any>();
  @Output() onEnd = new EventEmitter<any>();
  @Output() onServices = new EventEmitter<any>();
  @Output() onContacts = new EventEmitter<any>();
  @Output() onAccounts = new EventEmitter<any>();
  @Output() onTransactions = new EventEmitter<any>();
  @Output() onUsageTransactions = new EventEmitter<any>();
  @Output() onInstances = new EventEmitter<any>();
  @Output() onDefinitions = new EventEmitter<any>();
  @Output() onProfiles = new EventEmitter<any>();
  @Output() onNotes = new EventEmitter<any>();
  @Output() onStatus = new EventEmitter<any>();
  @Output() onReverse = new EventEmitter<any>();
  @Output() onDisputes = new EventEmitter<any>();
  @Output() onCharges = new EventEmitter<any>();
  @Output() onMessage = new EventEmitter<any>();
  @Output() onRowEmail = new EventEmitter<any>();
  @Output() onSuspend = new EventEmitter<any>();
  @Output() onUnSuspend = new EventEmitter<any>();
  @Output() onFlag = new EventEmitter<any>();
  @Output() onRunSchedule = new EventEmitter<any>();
  @Output() onSchedules = new EventEmitter<any>();
  @Output() onRunNow = new EventEmitter<any>();
  @Output() onExcel = new EventEmitter<any>();
  @Output() onPDF = new EventEmitter<any>();
  @Output() onDownload = new EventEmitter<any>();
  @Output() onRowRefresh = new EventEmitter<any>();
  @Output() onUpdateStatus = new EventEmitter<any>();
  @Output() onReallocate = new EventEmitter<any>();

  // Outputs for RowActionEvent of subTable
  @Output() onViewForSubTable = new EventEmitter<any>();

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;
  @ViewChild(MatTable) private table: MatTable<any>;

  tableColumns: string[] = [];
  dataSource: MatTableDataSource<any>; 
  queryParam: Paging = new Paging();
  
  currentPage: number = 1;
  showSearchOptions: boolean = false;

  expandedRow: any;
  subTablePermissions: PermissionType[] = ['Details'];

  private clonedHTMLTableElement: HTMLTableElement;
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    private dialog: MatDialog,
  ){}

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.action?.currentValue) {
      this.tableColumns = changes.action.currentValue.row.length > 0 
        ? [...this.columns, 'Action']
        : [...this.columns];
      
        if (changes.subTableColumns?.currentValue) {
          this.tableColumns.push('Expand');
        }
    }

    if (changes.searchOptions?.currentValue) {
      this.showSearchOptions = this.searchOptions.includes('Text') ? this.searchOptions.length > 1 : this.searchOptions.length > 0;
    }

    if (!this.dataSource) {
      this.dataSource = new MatTableDataSource(this.data);
    } else {      
      if (changes.data?.currentValue) {
        this.dataSource.data = changes.data.currentValue;
      }
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    if (this.usePagination) {
      merge(this.paginator.page).pipe(takeUntil(this.unsubscribeAll$)).subscribe((s) => {
        this.emitData();
      })
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  isNumber(val): boolean {
    return typeof val === 'number' && !Number.isInteger(val);
  }

  showToolbar(): boolean {
    return this.searchOptions?.length > 0 || this.action?.toolBar?.length > 0 || this.showSearchOptions;
  }

  toggleSearchOptions(val: boolean): void {
    this.onToggleSearchOptions.emit(val);
  }

  cancelSearch(): void {
    if (this.usePagination) {
      this.paginator.pageIndex = 0;
    }
    this.queryParam.SearchString = '';
    this.emitData();
  }

  searchInputEvent(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (this.usePagination) {
        this.paginator.pageIndex = 0;
      }
      this.queryParam.SearchString = (event.target as any).value;
      this.emitData();
    }
  }

  changeCurrentPage(event: KeyboardEvent): void {
    if (event.key === 'Enter') {

      if (this.currentPage > Math.round(this.totalCount / this.paginator.pageSize)) {
        this.tranService.errorMessage('invalid_page_number');
        this.currentPage = this.paginator.pageIndex + 1;
      } else {
        this.paginator.pageIndex = this.currentPage - 1;      
        this.emitData();
      }
    }
  }

  refresh(): void {
    if (this.usePagination) {
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = this.pageSizeOptions[0];
    }
    this.emitData();
  }

  exportExcel(): void { 
    this.clonedHTMLTableElement = (this.table as any)._elementRef.nativeElement.cloneNode(true);
    this.clonedHTMLTableElement.querySelectorAll('.to-be-removed').forEach(el => el.remove());
    
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.clonedHTMLTableElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, `${this.csvFileName}.xlsx`);
  }

  dblclick(data): void {
    this.onDoublClickRow.emit(data);
  }

  toggleExpandSubTable(event: PointerEvent, row: any): void {
    this.expandedRow = this.expandedRow === row ? null : row; 
    event.stopPropagation();
  }
  
  onToolBarEvent(event: DatatableToolBarAction): void {
    switch (event) {
      case 'Create':
        this.onCreate.emit();
        break;
      case 'Refresh':
        this.refresh();
        break;
      case 'ExportExcel':
        this.exportExcel();
        break;
      case 'Receipt':
        this.onReceipt.emit();
        break;
      case 'Invoice':
        this.onInvoice.emit();
        break;
      case 'CreditNote':
        this.onCreditNote.emit();
        break;
      case 'Refund':
        this.onRefund.emit();
        break;
      case 'DebitNote':
        this.onDebitNote.emit();
        break;
      case 'CreditAdjustment':
        this.onCreditAdjustment.emit();
        break;
      case 'DebitAdjustment':
        this.onDebitAdjustment.emit();
        break;
      case 'Email':
        this.onEmail.emit();
        break;
      case 'SMS':
        this.onSMS.emit();
        break;
      case 'ReverseRecentOne':
        this.onReverseRecentOne.emit();
        break;
      default:
        break;
    }
  }

  onRowEvent(event: DatatableRowAction, data: any): void {
    switch (event) {
      case 'Details':
        this.onView.emit(data);
        break;
      case 'Update':
        this.onEdit.emit(data);
        break;
      case 'Delete':
        this.delete(data);
        break;
      case 'Download':
        this.onDownload.emit(data);
        break;
      case 'History':
        this.onHistory.emit(data);
        break;
      case 'End':
        this.onEnd.emit(data);
        break;
      case 'Services':
        this.onServices.emit(data);
        break;
      case 'Contacts':
        this.onContacts.emit(data);
        break;
      case 'Accounts': 
        this.onAccounts.emit(data);
        break;
      case 'Transactions':
        this.onTransactions.emit(data);
        break;
      case 'UsageTransactions':
        this.onUsageTransactions.emit(data);
        break;
      case 'Instances':
        this.onInstances.emit(data);
        break;
      case 'Definitions':
        this.onDefinitions.emit(data);
        break;
      case 'Profiles':
        this.onProfiles.emit(data);
        break;
      case 'Notes':
        this.onNotes.emit(data);
        break;
      case 'Status':
        this.onStatus.emit(data);
        break;
      case 'Reverse':
        this.onReverse.emit(data);
        break;
      case 'Disputes':
        this.onDisputes.emit(data);
        break;
      case 'Charges':
        this.onCharges.emit(data);
        break;
      case 'Message':
        this.onMessage.emit(data);
        break;
      case 'RowEmail':
        this.onRowEmail.emit(data);
        break;
      case 'Suspend':
        this.onSuspend.emit(data);
        break;
      case 'UnSuspend':
        this.onUnSuspend.emit(data);
        break;
      case 'Flag':
        this.onFlag.emit(data);
        break;
      case 'RunSchedule':
        this.onRunSchedule.emit(data);
        break;
      case 'Schedules':
        this.onSchedules.emit(data);
        break;
      case 'RunNow':
        this.onRunNow.emit(data);
        break;
      case 'Excel':
        this.onExcel.emit(data);
        break;
      case 'PDF':
        this.onPDF.emit(data);
        break;
      case 'RowRefresh':
        this.onRowRefresh.emit(data);
        break;
      case 'UpdateStatus': 
        this.onUpdateStatus.emit(data);
        break;
      case 'Reallocate':
        this.onReallocate.emit(data);
        break;
      default:
        break;
    }
  }

  onRowEventForSubTable(event: DatatableRowAction, data: any): void {
    switch (event) {
      case 'Details':
        this.onViewForSubTable.emit(data);
        break;
      default:
        break;
    }
  }

  delete(data: any): void {
    const dialog = this.dialog.open(MatAlertComponent, {
      width: '100%',
      maxWidth: '450px',
      data: {
        Title: this.tranService.instant(this.messageForRowDeletion?.header ?? 'AreYouSure'),
        ErrorMessage: this.tranService.instant( this.messageForRowDeletion?.message ?? 'WarningMessageForDelete'),
        ButtonName: this.tranService.instant('Confirm'),
        ButtonOtherName: this.tranService.instant('Close')
      }
    });

    dialog.afterClosed().subscribe(res => {
      if (res === 'confirm') {
        this.onDelete.emit(data);
      }
    })
  }

  private emitData(): void {
    if (this.usePagination) {
      this.currentPage = this.paginator.pageIndex + 1;
      this.queryParam.TakeRecords = this.paginator.pageSize;
      this.queryParam.SkipRecords = this.paginator.pageIndex * this.paginator.pageSize;
    }
    this.onFetchData.emit(this.filterParams());
  }

  private filterParams(): FetchEmitEvent {
    return Object
      .entries({...this.queryParam})
      .reduce(
        (a, [key, val]) => ((val === null || val === undefined || val === '') ? a : (a[key] = val, a)), {}
      ) as FetchEmitEvent
  }
}
