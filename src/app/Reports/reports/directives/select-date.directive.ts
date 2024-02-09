import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { GlobalService } from 'src/services/global-service.service';


@Directive({
    selector: '[selectDate]'
})
export class SelectDateDirective {

    @Output('SelectDate') private SelectDate: EventEmitter<number> = new EventEmitter<number>();

    constructor(
        private el: ElementRef,
        public globService: GlobalService,) {

    }

    @HostListener('mouseenter') private onMouseEnter() {
        this.setClass('jqx-fill-state-normal-' + this.globService.themeColor);
    }

    @HostListener('mouseleave') private onMouseLeave() {
        if (!this.el.nativeElement.classList.contains('selected-day')) {
            this.removeClass('jqx-fill-state-normal-' + this.globService.themeColor);
        }
    }

    @HostListener('click') private onClick() {

        (!this.el.nativeElement.classList.contains('selected-day')) ?
            this.setClass('selected-day') : this.removeClass('selected-day');
        this.SelectDate.emit(~~(this.el.nativeElement.textContent.replace(/[^0-9]/g, '')));
    }


    private setClass = (className: string): void => {

        this.el.nativeElement.classList.add(className)
    };


    private removeClass = (className: string): void => {

        this.el.nativeElement.classList.remove(className);
    }

}
