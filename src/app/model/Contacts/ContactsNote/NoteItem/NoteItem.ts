import { NoteAttachment } from '../NoteAttachment/NoteAttachment'

export interface NoteItem {
    id: number,
    body: string,
    visibletocustomer: boolean,
    attachment: NoteAttachment[],
    createdby: string,
    createddatetime: string
}