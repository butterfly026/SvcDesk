import * as i0 from '@angular/core';
import { Injectable, EventEmitter, Component, Input, Output, NgModule } from '@angular/core';
import * as i1 from '@angular/common/http';
import { HttpHeaders, HttpClientModule } from '@angular/common/http';
import * as i2 from 'ckeditor4-angular';
import { CKEditorModule } from 'ckeditor4-angular';

class EditorLibService {
    constructor() { }
}
EditorLibService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: EditorLibService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
EditorLibService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: EditorLibService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: EditorLibService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: function () { return []; } });

class EditorLibComponent {
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

class EditorLibModule {
}
EditorLibModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: EditorLibModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
EditorLibModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.2.12", ngImport: i0, type: EditorLibModule, declarations: [EditorLibComponent], imports: [CKEditorModule,
        HttpClientModule], exports: [EditorLibComponent] });
EditorLibModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: EditorLibModule, imports: [CKEditorModule,
        HttpClientModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.12", ngImport: i0, type: EditorLibModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        EditorLibComponent
                    ],
                    imports: [
                        CKEditorModule,
                        HttpClientModule
                    ],
                    exports: [
                        EditorLibComponent
                    ]
                }]
        }] });

/*
 * Public API Surface of editor-lib
 */

/**
 * Generated bundle index. Do not edit.
 */

export { EditorLibComponent, EditorLibModule, EditorLibService };
//# sourceMappingURL=editor-lib.mjs.map
