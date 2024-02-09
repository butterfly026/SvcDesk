import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-service-event-instance',
  templateUrl: './service-event-instance.component.html',
  styleUrls: ['./service-event-instance.component.scss'],
})
export class ServiceEventInstanceComponent implements OnInit {

  @Input() ServiceReferenceId: number;
  @Input() ServiceId: string;
  @Input() Mode: string = 'List';
  @Output('EventInstanceComponent') EventInstanceComponent: EventEmitter<string> = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit(): void {}

  processEvent(event): void { 
    if (event === 'go-back') {
      this.EventInstanceComponent.emit('close')
    } else {
      this.EventInstanceComponent.emit(event);
    }
  }

}
