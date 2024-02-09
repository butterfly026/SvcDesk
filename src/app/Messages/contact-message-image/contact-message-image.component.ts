import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-contact-message-image',
  templateUrl: './contact-message-image.component.html',
  styleUrls: ['./contact-message-image.component.scss'],
})
export class ContactMessageImageComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() ImageType: string = 'list';

  @Output('ContactMessageComponent') ContactMessageComponent: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() { }

  processImage(event) {
    if (event === 'close') {
      this.ContactMessageComponent.emit('close');
    } else if (event === 'new') {
      this.ImageType = 'new'
    } else if (event === 'list') {
      this.ImageType = 'list'
    }
  }

}
