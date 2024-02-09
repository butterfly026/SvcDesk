import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-service-attribute-config',
  templateUrl: './service-attribute.component.html',
  styleUrls: ['./service-attribute.component.scss'],
})
export class ServiceAttributeComponent implements OnInit {

  @Input() ContactCode: String = '';
  @Output('ServiceAttribute') ServiceAttribute: EventEmitter<string> = new EventEmitter<string>();

  
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
    this.ServiceAttribute.emit('close');
  }

}
