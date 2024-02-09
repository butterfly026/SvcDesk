import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService } from 'src/services/global-service.service';
import { Note } from '../../models';

@Component({
  selector: 'app-service-notes-details',
  templateUrl: './service-notes-details.component.html',
  styleUrls: ['./service-notes-details.component.scss'],
})
export class ServiceNotesDetailsComponent {

  constructor(
    public globService: GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: { note: Note }
  ) { }

}
