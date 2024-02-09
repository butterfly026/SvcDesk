export type ContactMessageSMSNumber = {
  MSISDN: string;
}

export type SendSMSRequest = {
  Message: string;
  Due: Date;
  Addresses: ContactMessageSMSNumber[];
  CorrelationId: number;
  RequestDeliveryReceipt: boolean;
}