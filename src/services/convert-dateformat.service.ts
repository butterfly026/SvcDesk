import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class ConvertDateFormatService {

    constructor(
    ) {
    }

    ConvertDate(value) {
        if (value === null || value === '' || typeof (value) === 'undefined') {
            return '';
        } else {
            return moment(value).format(this.getLocalDateFormat());
        }
    }

    getLocalDateFormat() {
        let dateFormat = '';
        let currentDate = new Date('2019-11-25');
        let dateString = currentDate.toLocaleDateString();
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1;
        let day = currentDate.getDate();

        let yearSplit = dateString.split(year.toString());
        let monthSplit = [];
        let daySplit = [];
        let devider = '';
        if (!yearSplit[0].includes(month.toString())) {
            monthSplit = yearSplit[1].split(month.toString());
            if (!monthSplit[0].includes(day.toString())) {
                daySplit = monthSplit[1].split(day.toString());
                if (daySplit[0] === '') {
                    devider = daySplit[1];
                } else {
                    devider = daySplit[0];
                }
            } else {
                daySplit = monthSplit[0].split(day.toString());
                if (daySplit[0] === '') {
                    devider = daySplit[1];
                } else {
                    devider = daySplit[0];
                }
            }
        } else {
            monthSplit = yearSplit[0].split(month.toString());
            if (!monthSplit[0].includes(day.toString())) {
                daySplit = monthSplit[1].split(day.toString());
                if (daySplit[0] === '') {
                    devider = daySplit[1];
                } else {
                    devider = daySplit[0];
                }
            } else {
                daySplit = monthSplit[0].split(day.toString());
                if (daySplit[0] === '') {
                    devider = daySplit[1];
                } else {
                    devider = daySplit[0];
                }
            }
        }

        let dateSplit = dateString.split(devider);
        for (let list of dateSplit) {
            if (list.includes(year.toString())) {
                if (dateFormat === '') {
                    dateFormat = dateFormat + 'YYYY';
                } else {
                    dateFormat = dateFormat + devider + 'YYYY';
                }
            }
            if (list.includes(month.toString())) {
                if (dateFormat === '') {
                    dateFormat = dateFormat + 'MM';
                } else {
                    dateFormat = dateFormat + devider + 'MM';
                }
            }
            if (list.includes(day.toString())) {
                if (dateFormat === '') {
                    dateFormat = dateFormat + 'DD';
                } else {
                    dateFormat = dateFormat + devider + 'DD';
                }
            }
        }
        localStorage.setItem('dateFormat', dateFormat);
        return dateFormat;
    }

    newDateFormat(value) {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
    }

}
