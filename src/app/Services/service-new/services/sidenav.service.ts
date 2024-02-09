import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'

@Injectable({
    providedIn: 'root'
})
export class SidenavService {
    
    // default value.
    // this variable track the value between sessions.
    private _sideState: any = 'open';
  
    /** This is the mini variant solution with animations trick. */
    sideNavListener: any = new Subject();
  
    get sideNavState() {
      return this._sideState;
    }
  
    setSidenavState(state) {
      this._sideState = state;
    }
  
  
    constructor() {
  
      this.sideNavListener.subscribe( state => {
        this.setSidenavState(state);
      });
    
  
    }

}