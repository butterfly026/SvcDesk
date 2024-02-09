import { Directive, HostListener, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[columnWidthResize]'
})
export class ResponsiveGridDirective implements OnInit {


    @Input('columnWidthResize') private elemObj: any;

    @HostListener('window:resize', ['$event']) public onResize = (event) => {
        this._setGridWidth(window.innerWidth);
    };


    constructor() {
    }

    ngOnInit(): void {
        this._setGridWidth(window.innerWidth);
    }


    private _setGridWidth = (screenWidth: number): void => {

        if (screenWidth < 750)
            this.elemObj.attrColumns.map(value => value.width = value.widthPx);
        else
            this.elemObj.attrColumns.map(value => value.width = value.widthPercent + '%');

        this.elemObj.refreshdata();
    };


}
