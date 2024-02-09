export type GetContactNotes = {
  Count: number;
  Notes: Note[];
}

export type Note = {
  Id: number;
  Body: string;
  VisibleToCustomer: boolean;
  Editable: boolean;
  Attachments: NoteAttachment[],
  HistoryExists: boolean;
  Created: Date;
  CreatedBy: string;
}

export type NoteAttachment = {
  Id: number;
  URL: string;
}