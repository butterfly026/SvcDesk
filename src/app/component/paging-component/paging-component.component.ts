import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-paging-component',
  templateUrl: './paging-component.component.html',
  styleUrls: ['./paging-component.component.scss'],
})
export class PagingComponentComponent implements OnInit, OnChanges {


  @Input() totalLength: number = 0;
  @Input() pageRowNumber: number = 1;
  @Input() rowStep: string = '10';
  @Input() SkipRecords: number = 0;
  @Output('PagingComponent') PagingComponent: EventEmitter<any> = new EventEmitter<any>();

  maxPageRow: any;
  rowList = ['10', '20', '50', '100'];

  backSymbol = '⮜';
  forwardSymbol = '⮞';

  TakeRecords = 10;

  endIndex: number;
  keyPress: boolean = false;

  constructor(
    private tranService: TranService,
    public globService: GlobalService,
  ) {
    this.tranService.translaterService();
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.totalLength % parseInt(this.rowStep, 10) === 0) {
      this.maxPageRow = this.totalLength / parseInt(this.rowStep, 10);
    } else {
      this.maxPageRow = Math.floor(this.totalLength / parseInt(this.rowStep, 10)) + 1;
    }

    this.setIndexing();

    this.globService.globSubject.subscribe((result: any) => {
      if (result === 'refresh-grid') {
        this.rowStep = '10';
        this.pageRowNumber = 1;
        this.SkipRecords = 0;
        this.setIndexing();
      }
    })
  }

  reduceList() {
    if (this.SkipRecords - parseInt(this.rowStep, 10) > -1) {
      this.SkipRecords = this.SkipRecords - parseInt(this.rowStep, 10);
    } else {
      this.SkipRecords = 0;
    }
    if (this.pageRowNumber > 0) {
      this.pageRowNumber = this.pageRowNumber - 1;
      this.setPagingNumber();
    }
  }

  increaseList() {
    if (this.SkipRecords + parseInt(this.rowStep, 10) < this.totalLength) {
      this.SkipRecords = this.SkipRecords + parseInt(this.rowStep, 10);
    } else {
    }
    this.pageRowNumber = this.pageRowNumber + 1;
    this.setPagingNumber();
  }

  changePageNumber(event: any) {
    if (this.pageRowNumber < 1) {
      if (event != null && typeof (event.srcElement) !== 'undefined') {
        event.srcElement.value = 1;
        this.pageRowNumber = 1;
      }
    }
    if (this.pageRowNumber > this.maxPageRow) {
      if (event != null && typeof (event.srcElement) !== 'undefined') {
        event.srcElement.value = this.maxPageRow;
        this.pageRowNumber = this.maxPageRow;
      }
    }

    this.SkipRecords = (this.pageRowNumber - 1) * parseInt(this.rowStep, 10);
    if (event.key === 'Enter') {
      this.keyPress = true;
      this.setPagingNumber();
    }
  }

  focusChangePage() {

  }

  focusOutChangePage() {
    if (!this.keyPress) {
      this.SkipRecords = (this.pageRowNumber - 1) * parseInt(this.rowStep, 10);
      this.setPagingNumber();
    }
  }

  changeRowStep() {
    this.SkipRecords = 0;
    this.pageRowNumber = 1;
    this.TakeRecords = parseInt(this.rowStep, 10);
    this.setPagingNumber();
  }

  setIndexing() {
    if (this.totalLength % parseInt(this.rowStep, 10) === 0) {
      this.maxPageRow = this.totalLength / parseInt(this.rowStep, 10);
    } else {
      this.maxPageRow = Math.floor(this.totalLength / parseInt(this.rowStep, 10)) + 1;
    }

    this.endIndex = this.SkipRecords + parseInt(this.rowStep, 10);
    if (this.totalLength > 0) {
      if (this.SkipRecords > -1) {
        if (this.endIndex < this.totalLength) {
        } else {
          this.endIndex = this.totalLength;
        }
      }
    }
  }

  setPagingNumber() {
    this.setIndexing();
    const paging = {
      SkipRecords: this.SkipRecords,
      TakeRecords: parseInt(this.rowStep),
      pageRowNumber: this.pageRowNumber,
      rowStep: this.rowStep,
    };
    this.PagingComponent.emit(paging);
  }


}
