export type ContactMessageAttachment = {
  Id: number;
  DocumentId: number;
  Name: string;
}

export type ContactMessageReceipt = {
  Id: number;
  Type: string;
  Address: string;
  Status: 'NEW' | 'PENDING' | 'INPROGRESS' | 'CANCELLED' | 'ONHOLD' | 'FAILED' | 'COMPLETED' | 'CONFIRMED';
  StatusLastUpdated: Date;
  CreatedBy: string;
  Created: Date;
  LastUpdated: Date;
  UpdatedBy: string;
}

export type ContactMessage = {
  Id: number;
  Created: Date;
  CreatedBy: string;
  DeliveryReceiptRequested: boolean;
  CorrelationId: number;
  Importance: string;
  Attachments: ContactMessageAttachment[];
  BodyFormat: 'HTML' | 'TEXT';
  LastUpdated: Date;
  Body: string;
  Sender: string;
  Addresses: ContactMessageReceipt[];
  Due: Date;
  StatusLastUpdated: Date;
  Status: 'UNASSIGNED' | 'UNREAD' | 'NEW' | 'PENDING' | 'INPROGRESS' | 'CANCELLED' | 'ONHOLD' | 'PARTIALFAILURE' | 'FAILED' | 'COMPLETED';
  Direction: 'OUT' | 'IN';
  Type: 'IM' | 'NOTIFICATION';
  Subject: string;
  UpdatedBy: string;
}

export type GetMessagesResponse = {
  Count: number;
  Messages: ContactMessage[];
}

