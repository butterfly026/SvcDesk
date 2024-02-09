import { EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as i0 from "@angular/core";
export declare class EditorLibComponent implements OnInit {
    private http;
    htmlText: string;
    jwtToken: string;
    changeEvent: EventEmitter<any>;
    placeholders: string[];
    private placeHolderObj;
    constructor(http: HttpClient);
    change(event: any): void;
    ngOnInit(): void;
    setPlaceholdersIds(placeholders: any[]): any[];
    onEditorReady(event: any): void;
    textTestCallback: (range: any) => any;
    matchCallback: (text: any, offset: any) => {
        start: any;
        end: any;
    } | null;
    dataCallback: (matchInfo: any, callback: any) => void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EditorLibComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EditorLibComponent, "mail-editor", never, { "htmlText": "htmlText"; "jwtToken": "jwtToken"; }, { "changeEvent": "changeEvent"; }, never, never, false>;
}
