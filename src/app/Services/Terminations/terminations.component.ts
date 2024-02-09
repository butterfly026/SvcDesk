import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComponentOutValue } from 'src/app/model';
import { TranService } from 'src/services';


@Component({
  selector: 'app-terminations',
  templateUrl: './terminations.component.html',
  styleUrls: ['./terminations.component.scss'],
})
export class TerminationsComponent implements OnInit {

  @Input() ContactCode: string = '';
  @Input() ServiceReference: string = '';
  @Input() ServiceType: string = '';
  @Output('TerminationsComponent') TerminationsComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();


  terminationMode: string = 'terminationService';

  constructor(
    private tranService: TranService,

  ) {
    this.tranService.translaterService();

  }

  ngOnInit() {
    console.log('ServiceReference', this.ServiceReference);
  }

  processTerminations(event) {
    if (event?.type === 'terminationService') {
      this.terminationMode = event;
    } else if (event?.type === 'terminationDetail') {
      this.terminationMode = event;
    } else if (event?.type === 'close') {
      this.TerminationsComponent.emit({ type: 'close' });
    }
  }

}
