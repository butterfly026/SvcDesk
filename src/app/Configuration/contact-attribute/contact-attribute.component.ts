import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-contact-attribute',
  templateUrl: './contact-attribute.component.html',
  styleUrls: ['./contact-attribute.component.scss'],
})
export class ContactAttributeComponent implements OnInit {

  @Input() ContactCode: String = '';
  @Output('ContactAttribute') ContactAttribute: EventEmitter<string> = new EventEmitter<string>();


  showClose: boolean = true;

  constructor(
    public globService: GlobalService,
  ) {

  }

  ngOnInit() { }

  processComponent(event) {
    if (event === 'view' || event === 'setBothHeight') {
      this.showClose = true;
    } else {
      this.showClose = false;
    }
  }

  close() {
    this.ContactAttribute.emit('close');
  }

}
