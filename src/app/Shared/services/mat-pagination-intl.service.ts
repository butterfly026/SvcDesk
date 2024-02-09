import { Injectable, OnDestroy } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatPaginationIntlService extends MatPaginatorIntl implements OnDestroy {

  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private translateService: TranslateService
  ) { 
    super();

    this.translateService.onLangChange.subscribe((event: Event) => {
      this.translateLabels();
    });

    this.translateLabels();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  getRangeLabel = (page: number, pageSize: number, length: number): string => {
    const of = this.translateService ? this.translateService.instant("Of") : "of";
    
    if (length === 0 || pageSize === 0) {
      return "0 " + of + " " + length;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize > length ? (Math.ceil(length / pageSize) - 1) * pageSize : page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return startIndex + 1 + " - " + endIndex + " " + of + " " + length;
  };

  injectTranslateService(translate: TranslateService): void {
    this.translateService = translate;

    this.translateService.onLangChange.subscribe(() => {
      this.translateLabels();
    });

    this.translateLabels();
  }

  private translateLabels(): void {
    this.firstPageLabel = this.translateService.instant("FirstPage");
    this.itemsPerPageLabel = this.translateService.instant("ItemsPerPage");
    this.lastPageLabel = this.translateService.instant("LastPage");
    this.nextPageLabel = this.translateService.instant("NextPage");
    this.previousPageLabel = this.translateService.instant("PreviousPage");
    this.changes.next(); // Fire a change event to make sure that the labels are refreshed
  }
}
