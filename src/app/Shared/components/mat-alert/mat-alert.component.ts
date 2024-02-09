import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mat-alert',
  templateUrl: './mat-alert.component.html',
  styleUrls: ['./mat-alert.component.scss']
})
export class MatAlertComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<MatAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public errorData: any
  ) {}
  
  ngOnInit() {

  }

  closeDialog(result: string){
    this.dialogRef.close(result);
  }

}
