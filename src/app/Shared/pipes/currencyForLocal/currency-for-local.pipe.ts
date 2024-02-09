import { Pipe, PipeTransform } from '@angular/core';
import { GlobalService } from 'src/services/global-service.service';

@Pipe({
  name: 'currencyForLocal'
})
export class CurrencyForLocalPipe implements PipeTransform {

  constructor(
    private globalService: GlobalService,
  ) {}

  transform(value: unknown): unknown {
    if (typeof (value) === 'number' || !Number.isNaN(value)) {
      return this.globalService.getCurrencyConfiguration(value);
    } else {
      return value;
    }
  }

}
