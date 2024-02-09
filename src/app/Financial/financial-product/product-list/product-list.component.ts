import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ComponentOutValue, Paging } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ProductListService } from './services/product-list.service';
import { DatatableAction, SearchOption } from 'src/app/Shared/models';
import { Product } from './product-list.componenttype';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnChanges, OnDestroy {
  @Input() FinancialId: string = '';
  @Output('ProductListComponent') ProductListComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  totalCount: number = 0;
  dataSource: Product[] = [];
  dataTableAction: DatatableAction = { row: [], toolBar: ['Refresh', 'ExportExcel'] };
  csvFileName: string;
  searchOptions: SearchOption[] = ['Text'];
  columns: string[] = [ 'SKU', 'Name', 'SerialNumber', 'Quantity', 'UOM', 'UnitPrice', 'UnitTax' ];
  
  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private tranService: TranService,
    public globService: GlobalService,
    private loading: LoadingService,
    private productService: ProductListService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.FinancialId?.currentValue) {
      this.csvFileName = this.tranService.instant('FinancialTransactionsProductlist') + ' ' + this.FinancialId;
      this.getChargesList();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  async fetchData(event: Paging): Promise<void> {
    this.eventParam = {
      CountRecords: 'Y',
      ...event
    }
    await this.loading.present();
    this.getChargesList();
  }

  private async getChargesList(): Promise<void> {
    this.productService.FinantialProducts(this.FinancialId, this.eventParam)
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe({
        next: async (result) =>{
          await this.loading.dismiss();
          if (result === null) {
            this.tranService.errorMessage('NoProduct');
          } else {
            this.totalCount = result.length;
            this.dataSource = result;
          }
        },
        error: async (error: any) => {
          await this.loading.dismiss();
          this.tranService.errorMessage(error);
        }
      })
  }

}
