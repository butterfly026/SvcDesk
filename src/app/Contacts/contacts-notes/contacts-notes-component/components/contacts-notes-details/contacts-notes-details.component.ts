import { Component, Inject } from '@angular/core';
import { GlobalService } from 'src/services/global-service.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Note } from '../../models';

@Component({
  selector: 'app-contacts-notes-details',
  templateUrl: './contacts-notes-details.component.html',
  styleUrls: ['./contacts-notes-details.component.scss'],
})
export class ContactsNotesDetailsComponent {

  constructor(
    public globService: GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: { note: Note }
  ) { }
}
