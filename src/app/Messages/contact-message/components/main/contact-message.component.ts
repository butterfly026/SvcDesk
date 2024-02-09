import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-contact-message',
  templateUrl: './contact-message.component.html',
  styleUrls: ['./contact-message.component.scss'],
})
export class ContactMessageComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() MessageType: string = 'list';

  @Output('ContactMessageComponent') ContactMessageComponent: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() { }

  processMessage(event) {
    if (event === 'close') {
      this.ContactMessageComponent.emit('close');
    } else if (event === 'new') {
      // this.MessageType = 'new'
    } else if (event.includes('update')) {

    } else if (event === 'new_sms') {
      this.MessageType = 'new_sms'
    } else if (event === 'new_email') {
      this.MessageType = 'new_email'
    } else if (event === 'list') {
      this.MessageType = 'list'
    }
  }

  processSMS(event) {
    if (event === 'sms_list') {
      this.MessageType = 'list';
    }
  }

  processEmail(event) {
    if (event === 'list') {
      this.MessageType = 'list';
    }
  }

}
