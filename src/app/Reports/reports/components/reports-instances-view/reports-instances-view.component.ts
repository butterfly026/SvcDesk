import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService } from 'src/services/global-service.service';
import { ReportInstance } from '../../models';

@Component({
  selector: 'app-reports-instances-view',
  templateUrl: './reports-instances-view.component.html',
  styleUrls: ['./reports-instances-view.component.scss'],
})
export class ReportsInstancesViewComponent {

  constructor(
    public globService: GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: { data: ReportInstance }
  ) {}
  
}
