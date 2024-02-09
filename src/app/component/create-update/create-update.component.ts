import { Component, Input, OnInit } from '@angular/core';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.scss'],
})
export class CreateUpdateComponent implements OnInit {

  @Input() title: string = '';
  @Input() value: string = '';
  @Input() inputData: any = {
    created: '',
    createdBy: '',
    updated: '',
    updatedBy: '',
  };
  constructor(
    private tranService: TranService,
    public globService: GlobalService,
  ) {
  }

  ngOnInit() {
    this.value = this.globService.newDateFormat(this.value);
  }

}
