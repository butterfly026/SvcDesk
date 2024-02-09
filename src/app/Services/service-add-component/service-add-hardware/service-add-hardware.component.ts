import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-service-add-hardware',
  templateUrl: './service-add-hardware.component.html',
  styleUrls: ['./service-add-hardware.component.scss'],
})
export class ServiceAddHardwareComponent implements OnInit {

  @Input() HardwareList: any[] = [];
  @Output('ServiceAddHardwareComponent') ServiceAddHardwareComponent: EventEmitter<string> = new EventEmitter<string>();

  

  constructor(
    
    public globService: GlobalService,
  ) {
    
  }

  ngOnInit() {
    for (let list of this.HardwareList) {
      if (list.key.includes('unit')) {
        list.value = this.globService.getCurrencyConfiguration(list.value);
      }
    }
  }

}
