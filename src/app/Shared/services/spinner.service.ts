import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { SpinnerComponent } from '../components';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private spinnerRef: MatDialogRef<SpinnerComponent>;
  private isLoaded: boolean = false;
  constructor(
    private dialog: MatDialog,
  ) { }

  loading(): void {
    if(!this.isLoaded){
      this.spinnerRef = this.dialog.open(SpinnerComponent, { disableClose: true });
      this.isLoaded = true;
    }
    
  }

  end(): void {
    this.spinnerRef.close();
    this.isLoaded = false;
  }
}
