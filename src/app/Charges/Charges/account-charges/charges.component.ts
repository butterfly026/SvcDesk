import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.scss'],
})
export class ChargesComponent implements OnInit {
  @Input() ContactCode: string = '';
  @Input() ChargeType: string = '';
  @Input() ViewMode: string = 'list';
  
  @Output('ChargesComponent') ChargesComponent: EventEmitter<string> = new EventEmitter<string>();

  constructor(public matDialog: MatDialog) { }

  ngOnInit() {
    if (this.ChargeType !== '') {
      this.ViewMode = this.ChargeType;
    }
  }

  processCharge(event) {
    if (this.ChargeType === '' || this.ChargeType === 'list') {
      if(typeof event == 'string'){
        if (event === 'close') {
          this.ChargesComponent.emit('close');
        }
        if (event === 'list') {
          this.ViewMode = 'list';
        }
      }
    } else {
      this.ChargesComponent.emit(event);
    }
  }

}
