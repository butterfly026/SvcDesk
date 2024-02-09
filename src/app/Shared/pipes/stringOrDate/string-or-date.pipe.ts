import { Injectable, Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
@Pipe({
  name: 'stringOrDate'
})
export class StringOrDatePipe implements PipeTransform {
  transform(
    value: any,
    format: string
  ): string {
  if (typeof value !== 'string' || !value.includes('-') || !value.includes(':') || new Date(value).toString() === 'Invalid Date') {
      return value;
    } else {
      return moment(value).format(format)
    }
  }

}
