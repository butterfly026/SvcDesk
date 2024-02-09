import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "ckeditor4-angular";
export class EditorLibComponent {
    constructor(http) {
        this.http = http;
        this.htmlText = '';
        this.jwtToken = '';
        this.changeEvent = new EventEmitter();
        this.placeholders = [];
        this.placeHolderObj = [];
        this.textTestCallback = (range) => {
            if (!range.collapsed) {
                return null;
            }
            return CKEDITOR.plugins.textMatch.match(range, this.matchCallback);
        };
        this.matchCallback = (text, offset) => {
            const pattern = /\[{2}([A-z]|\])*$/;
            const match = text.slice(0, offset).match(pattern);
            if (!match) {
                return null;
            }
            return { start: match.index, end: offset };
        };
        this.dataCallback = (matchInfo, callback) => {
            const data = this.placeHolderObj.filter(function (item) {
                const itemName = '[[' + item.name + ']]';
                return itemName.indexOf(matchInfo.query.toLowerCase()) == 0;
            });
            callback(data);
        };
    }
    change(event) {
        this.changeEvent.emit(CKEDITOR.currentInstance.getData());
    }
    ngOnInit() {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.jwtToken}`
            })
        };
        const observableTokens = this.http.get('https://ua-api.selcomm.com/Messages/Metatags?api-version=1.0', httpOptions);
        observableTokens.subscribe(tokens => {
            this.placeholders = tokens;
            this.placeHolderObj = this.setPlaceholdersIds(this.placeholders);
        });
    }
    setPlaceholdersIds(placeholders) {
        let result = [];
        placeholders.forEach((placeholdes, index) => {
            result.push({ id: index, name: placeholdes });
        });
        return result;
    }
    onEditorReady(event) {
        CKEDITOR.plugins.load('textmatch', (_) => {
        });
        CKEDITOR.plugins.load('autocomplete', (_) => {
            new CKEDITOR.plugins.autocomplete(event.editor, {
                textTestCallback: this.textTestCallback,
                dataCallback: this.dataCallback,
                itemTemplate: '<li data-id="{id}">' +
                    '<div><strong class="item-title">{name}</strong></div>' +
                    '</li>',
                outputTemplate: '[[{name}]]<span>&nbsp;</span>',
            });
        });
    }
}
EditorLibComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: EditorLibComponent, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Component });
EditorLibComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.2.12", type: EditorLibComponent, selector: "mail-editor", inputs: { htmlText: "htmlText", jwtToken: "jwtToken" }, outputs: { changeEvent: "changeEvent" }, ngImport: i0, template: "<ckeditor [data]=\"htmlText\" (ready)=\"onEditorReady($event)\" (change)=\"change($event)\" ></ckeditor>\r\n", dependencies: [{ kind: "component", type: i2.CKEditorComponent, selector: "ckeditor", inputs: ["editorUrl", "tagName", "type", "data", "readOnly", "config"], outputs: ["namespaceLoaded", "ready", "dataReady", "change", "dataChange", "dragStart", "dragEnd", "drop", "fileUploadResponse", "fileUploadRequest", "focus", "paste", "afterPaste", "blur"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: EditorLibComponent, decorators: [{
            type: Component,
            args: [{ selector: 'mail-editor', template: "<ckeditor [data]=\"htmlText\" (ready)=\"onEditorReady($event)\" (change)=\"change($event)\" ></ckeditor>\r\n" }]
        }], ctorParameters: function () { return [{ type: i1.HttpClient }]; }, propDecorators: { htmlText: [{
                type: Input
            }], jwtToken: [{
                type: Input
            }], changeEvent: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLWxpYi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9lZGl0b3ItbGliL3NyYy9saWIvZWRpdG9yLWxpYi5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9lZGl0b3ItbGliL3NyYy9saWIvZWRpdG9yLWxpYi5jb21wb25lbnQuaHRtbCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9FLE9BQU8sRUFBYyxXQUFXLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQzs7OztBQVkvRCxNQUFNLE9BQU8sa0JBQWtCO0lBVTdCLFlBQW9CLElBQWU7UUFBZixTQUFJLEdBQUosSUFBSSxDQUFXO1FBUjFCLGFBQVEsR0FBVSxFQUFFLENBQUM7UUFDckIsYUFBUSxHQUFVLEVBQUUsQ0FBQztRQUNwQixnQkFBVyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFFcEMsaUJBQVksR0FBWSxFQUFFLENBQUM7UUFFMUIsbUJBQWMsR0FBUyxFQUFFLENBQUM7UUE2QzNCLHFCQUFnQixHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDbEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUU7Z0JBQ3BCLE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFDRCxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQztRQUVLLGtCQUFhLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDdEMsTUFBTSxPQUFPLEdBQUcsbUJBQW1CLENBQUM7WUFDcEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENB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O2dCQUNJLFdBQVc7c0JBQXBCLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEh0dHBDbGllbnQsIEh0dHBIZWFkZXJzIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vbi9odHRwXCI7XHJcbmltcG9ydCB7IENLRWRpdG9yNCB9IGZyb20gJ2NrZWRpdG9yNC1hbmd1bGFyL2NrZWRpdG9yJztcclxuXHJcbmRlY2xhcmUgY29uc3QgQ0tFRElUT1I7XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdtYWlsLWVkaXRvcicsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2VkaXRvci1saWIuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlczogW1xyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEVkaXRvckxpYkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcblxyXG4gIEBJbnB1dCgpIGh0bWxUZXh0OnN0cmluZyA9ICcnO1xyXG4gIEBJbnB1dCgpIGp3dFRva2VuOnN0cmluZyA9ICcnO1xyXG4gIEBPdXRwdXQoKSBjaGFuZ2VFdmVudCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgcHVibGljIHBsYWNlaG9sZGVyczpzdHJpbmdbXSA9IFtdO1xyXG5cclxuICBwcml2YXRlIHBsYWNlSG9sZGVyT2JqOmFueVtdID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDpIdHRwQ2xpZW50KSB7IH1cclxuXHJcbiAgY2hhbmdlKGV2ZW50KSB7XHJcbiAgICB0aGlzLmNoYW5nZUV2ZW50LmVtaXQoQ0tFRElUT1IuY3VycmVudEluc3RhbmNlLmdldERhdGEoKSlcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgbGV0IGh0dHBPcHRpb25zID0ge1xyXG4gICAgICBoZWFkZXJzOiBuZXcgSHR0cEhlYWRlcnMoe1xyXG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgJ0F1dGhvcml6YXRpb24nOiBgQmVhcmVyICR7dGhpcy5qd3RUb2tlbn1gXHJcbiAgICAgIH0pXHJcbiAgICB9O1xyXG4gICAgY29uc3Qgb2JzZXJ2YWJsZVRva2VucyA9IHRoaXMuaHR0cC5nZXQ8c3RyaW5nW10+KCdodHRwczovL3VhLWFwaS5zZWxjb21tLmNvbS9NZXNzYWdlcy9NZXRhdGFncz9hcGktdmVyc2lvbj0xLjAnLCBodHRwT3B0aW9ucyk7XHJcbiAgICBvYnNlcnZhYmxlVG9rZW5zLnN1YnNjcmliZSh0b2tlbnMgPT4ge1xyXG4gICAgICB0aGlzLnBsYWNlaG9sZGVycyA9IHRva2Vuc1xyXG4gICAgICB0aGlzLnBsYWNlSG9sZGVyT2JqID0gdGhpcy5zZXRQbGFjZWhvbGRlcnNJZHModGhpcy5wbGFjZWhvbGRlcnMpXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldFBsYWNlaG9sZGVyc0lkcyhwbGFjZWhvbGRlcnM6YW55W10pOmFueVtdIHtcclxuICAgIGxldCByZXN1bHQ6IGFueVtdID0gW107XHJcbiAgICBwbGFjZWhvbGRlcnMuZm9yRWFjaCgocGxhY2Vob2xkZXMsIGluZGV4KSA9PiB7XHJcbiAgICAgIHJlc3VsdC5wdXNoKHtpZDogaW5kZXgsIG5hbWU6IHBsYWNlaG9sZGVzfSk7XHJcbiAgICB9KVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIG9uRWRpdG9yUmVhZHkoZXZlbnQpIHtcclxuICAgIENLRURJVE9SLnBsdWdpbnMubG9hZCgndGV4dG1hdGNoJywgKF8pID0+IHtcclxuICAgIH0pXHJcbiAgICBDS0VESVRPUi5wbHVnaW5zLmxvYWQoJ2F1dG9jb21wbGV0ZScsIChfKSA9PiB7XHJcbiAgICAgIG5ldyBDS0VESVRPUi5wbHVnaW5zLmF1dG9jb21wbGV0ZShldmVudC5lZGl0b3IsIHtcclxuICAgICAgICB0ZXh0VGVzdENhbGxiYWNrOiB0aGlzLnRleHRUZXN0Q2FsbGJhY2ssXHJcbiAgICAgICAgZGF0YUNhbGxiYWNrOiB0aGlzLmRhdGFDYWxsYmFjayxcclxuICAgICAgICBpdGVtVGVtcGxhdGU6ICc8bGkgZGF0YS1pZD1cIntpZH1cIj4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICc8ZGl2PjxzdHJvbmcgY2xhc3M9XCJpdGVtLXRpdGxlXCI+e25hbWV9PC9zdHJvbmc+PC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAnPC9saT4nLFxyXG4gICAgICAgIG91dHB1dFRlbXBsYXRlOiAnW1t7bmFtZX1dXTxzcGFuPiZuYnNwOzwvc3Bhbj4nLFxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdGV4dFRlc3RDYWxsYmFjayA9IChyYW5nZSkgPT4ge1xyXG4gICAgaWYgKCFyYW5nZS5jb2xsYXBzZWQpIHtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gQ0tFRElUT1IucGx1Z2lucy50ZXh0TWF0Y2gubWF0Y2gocmFuZ2UsIHRoaXMubWF0Y2hDYWxsYmFjayk7XHJcbiAgfTtcclxuXHJcbiAgcHVibGljIG1hdGNoQ2FsbGJhY2sgPSAodGV4dCwgb2Zmc2V0KSA9PiB7XHJcbiAgICBjb25zdCBwYXR0ZXJuID0gL1xcW3syfShbQS16XXxcXF0pKiQvO1xyXG4gICAgY29uc3QgbWF0Y2ggPSB0ZXh0LnNsaWNlKDAsIG9mZnNldCkubWF0Y2gocGF0dGVybik7XHJcbiAgICBpZiAoIW1hdGNoKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHsgc3RhcnQ6IG1hdGNoLmluZGV4LCBlbmQ6IG9mZnNldCB9O1xyXG4gIH07XHJcblxyXG4gIHB1YmxpYyBkYXRhQ2FsbGJhY2sgPSAobWF0Y2hJbmZvLCBjYWxsYmFjaykgPT4ge1xyXG4gICAgY29uc3QgZGF0YSA9IHRoaXMucGxhY2VIb2xkZXJPYmouZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XHJcbiAgICAgIGNvbnN0IGl0ZW1OYW1lID0gJ1tbJyArIGl0ZW0ubmFtZSArICddXSc7XHJcbiAgICAgIHJldHVybiBpdGVtTmFtZS5pbmRleE9mKG1hdGNoSW5mby5xdWVyeS50b0xvd2VyQ2FzZSgpKSA9PSAwO1xyXG4gICAgfSk7XHJcbiAgICBjYWxsYmFjayhkYXRhKTtcclxuICB9O1xyXG59XHJcbiIsIjxja2VkaXRvciBbZGF0YV09XCJodG1sVGV4dFwiIChyZWFkeSk9XCJvbkVkaXRvclJlYWR5KCRldmVudClcIiAoY2hhbmdlKT1cImNoYW5nZSgkZXZlbnQpXCIgPjwvY2tlZGl0b3I+XHJcbiJdfQ==