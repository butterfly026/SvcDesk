import { Directive, HostListener, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    selector: '[formControlName][appPercentageMask]',
})
export class PercentageMaskDirective implements OnInit {

    constructor(public ngControl: NgControl) { }

    ngOnInit() {
    }

    @HostListener('keyup', ['$event'])
    keydownBackspace(event) {
        this.onInputChange(event.target.value, event.keyCode);
    }


    onInputChange(event, keyCode) {
        let newVal = event.replace(/[^.\d]/g, '')
            .replace(/^(\d*\.?)|(\d*)\.?/g, '$1$2');

        if (keyCode === 8) {
            newVal = newVal.slice(0, -1);
        }

        if (newVal.slice(newVal.length - 1) === '.' || newVal === '100') {
        } else {
            if (Number(newVal) > 100 && newVal.includes('100.')) {
                newVal = '0.' + newVal.split('.')[1];
            } else {
                newVal = (Number(Number(newVal) % 100)).toString();
            }
        }
        if (newVal === '' || newVal.toLowerCase() === 'nan') {
            this.ngControl.control.setValue('0' + '%');
        } else {
            this.ngControl.control.setValue(newVal + '%');
        }
    }
}
