import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { SpinnerComponent } from '../components';
import { MatAlertComponent } from '../components/mat-alert/mat-alert.component';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MatAlertService {

  private alertRef: MatDialogRef<SpinnerComponent>;

  constructor(
    private dialog: MatDialog,
  ) { }

  alert(errorMessage: string, title: string, buttonName: string, buttonOtherName?: string):  Observable<boolean>  {
    this.alertRef = this.dialog.open(MatAlertComponent, {
      disableClose: true,
      data: {
        ErrorMessage: errorMessage,
        ButtonName: buttonName,
        ButtonOtherName: buttonOtherName,
        Title: title,
      }
    });
    return this.alertRef.afterClosed().pipe(
      map(result => {
        if (result === 'confirm') {
          return true;
        } else {
          return false;
        }
      })
    ); 
  }

  end(): void {
    this.alertRef.close();
  }
}
