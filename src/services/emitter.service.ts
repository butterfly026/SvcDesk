import {Injectable} from '@angular/core';
import {filter, map} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EmitterService {
    
    private rxSubject$: Subject<any> = new Subject<any>();
    private rxSubjectAsObservable$: Observable<any> = this.rxSubject$.asObservable();
    
    constructor() {
    }
    
    
    public emitEvent = (eventName: string, data: any) => this.rxSubject$.next({eventName, data});
    
    
    public listenEvent = (evt: string): Observable<any> => this.rxSubjectAsObservable$
        .pipe(
            filter(vl => vl.eventName === evt),
            map(rp => rp.data)
        );
    
    
    public removeEvent = (): void => this.rxSubject$.next();
    
}
