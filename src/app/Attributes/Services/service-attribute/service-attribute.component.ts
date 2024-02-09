import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';
import { ComponentOutValue } from 'src/app/model';
import { TranService, LoadingService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';
import { ServiceAttributeService } from './services/service-attribute.service';

@Component({
  selector: 'app-service-attribute',
  templateUrl: './service-attribute.component.html',
  styleUrls: ['./service-attribute.component.scss'],
})
export class ServiceAttributeComponent implements OnInit {
  @Input() ServiceReference: string = '';
  @Input() ServiceId: string = '';
  @Output() ServiceAttributeComponent: EventEmitter<ComponentOutValue> = new EventEmitter<ComponentOutValue>();

  attributeState: string = 'list';
  updateData: any;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private tranService: TranService,
    private loading: LoadingService,
    public globService: GlobalService,
    private attService: ServiceAttributeService,
  ) { }

  ngOnInit() {
  }

  processAttributes(event) {
    switch (event.type) {
      case 'close':
        this.ServiceAttributeComponent.emit(event);
        break;
      case 'list':
        this.attributeState = 'list';
        break;
      case 'add':
        this.attributeState = 'add';
        break;
      case 'update':
        this.attributeState = 'update';
        this.updateData = event.data;
        break;
      default:
        break;
    }
  }

}
