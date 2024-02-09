import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-email-send',
  templateUrl: './email-send.component.html',
  styleUrls: ['./email-send.component.scss'],
})
export class EmailSendComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Output('EmailSendComponent') EmailSendComponent: EventEmitter<string> = new EventEmitter<string>();

  pageState: string = 'list';

  constructor() { }

  ngOnInit() { }

  processEmail(event) {
    
    if (event === 'close') {
      this.EmailSendComponent.emit('close');
    } else {
      this.pageState = event;
    }
  }

}
