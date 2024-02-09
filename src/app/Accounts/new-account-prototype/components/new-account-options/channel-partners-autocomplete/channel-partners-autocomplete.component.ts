import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Paging } from 'src/app/model';
import { TranService } from 'src/services';
import { ChannelPartner } from '../../../models';
import { AccountOptionsService } from '../../../services';

@Component({
  selector: 'app-channel-partners-autocomplete',
  templateUrl: './channel-partners-autocomplete.component.html',
  styleUrls: ['./channel-partners-autocomplete.component.scss'],
})
export class ChannelPartnersAutocompleteComponent implements OnChanges, OnDestroy {

  @Input() channelPartnerIdControl: FormControl;

  showSpinner: boolean;
  channelPartners: ChannelPartner[] = [];
  available: boolean = true;

  private eventParam = new Paging();
  private unsubscribeAll$: Subject<any> = new Subject<any>();

  constructor(
    private accountOptionsService: AccountOptionsService,
    private tranService: TranService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.channelPartnerIdControl?.currentValue) {
      this.channelPartnerIdControl.valueChanges
        .pipe(
          takeUntil(this.unsubscribeAll$),
          debounceTime(1000)
        )
        .subscribe(result => {
          if (result && this.available) {
            this.showSpinner = true;
            this.eventParam.SearchString = result;
            this.getChannelPartners();
          }
          this.available = true;
        })
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeAll$.next(null);
    this.unsubscribeAll$.complete();
  }

  clearField(): void {
    this.channelPartnerIdControl.reset();
  }

  selectChannelPartner(event: MatAutocompleteSelectedEvent): void {
    this.available = false;
    this.channelPartnerIdControl.setValue(event.option.value);
  }

  private getChannelPartners(): void {
    this.accountOptionsService.getChannelPartners(this.eventParam)
      .pipe(
        takeUntil(this.unsubscribeAll$),
        finalize(() => this.showSpinner = false)
      )
      .subscribe({
        next: result => {
          this.channelPartners = result.Items
          this.channelPartnerIdControl.setErrors({
            invalid: this.tranService.instant(
              result.Count === 0 ? 'InvalidChannelPartner': 'ChannelPartnerShouldBeSelectedFromList'
            )
          });
        },
        error: error => this.tranService.errorMessage(error)
      })
  }

}
