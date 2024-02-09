export type SendEmailRequestRecipient = {
  Type: string;
  Address: string;
}

export type SendEmailRequestAttachment = {
  Type: string[],
  DocumentId: number;
}

export type SendEmailRequest = {
  Subject: string;
  Body: string;
  BodyFormat: string;
  Due: Date;
  Recipients: SendEmailRequestRecipient[];
  Priority: string;
  Attachments: SendEmailRequestAttachment[];
  TemplateId: number;
  CorrelationId: number;
  RequestDeliveryReceipt: boolean;
}

export type EmailConfiguration = {
  CC: boolean;
  BCC: boolean;
  ExternalAttachments: boolean;
  Attachments: boolean;
  Templates: boolean;
  DueDate: boolean;
  MaximumScheduleDays: number;
  DeliveryConfirmation: boolean;
  EmailFormat: string;
}

export type ContactMessageEmail = {
  Address: string;
}

export type AvailableDocument = {
  Id: number;
  Type: string;
  Name: string;
  Date: Date;
}

export type GetAvailableDocumentsResponse = {
  Count: number;
  Documents: AvailableDocument[];
}