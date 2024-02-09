
export type AccountConfigurationDefaultItem = {
  Order?: number;
  Enabled: boolean;
}

export type AccountConfigurationOption = {
  Enabled: boolean;
  Default?: boolean | string;
}

export type AccountConfigurationOptions = {
  Order: number;
  Enabled: boolean;
  DefaultCreditLimit: {
    Enabled: boolean;
    CreditLimit: 0
  },
  BillFormat: AccountConfigurationOption;
  PaperBill: AccountConfigurationOption;
  EmailBill: AccountConfigurationOption;
  CreditStatus: AccountConfigurationOption;
  ChannelPartner: AccountConfigurationOption;
  SalesPerson: AccountConfigurationOption;
}

export type AccountConfigurationPaymentMethods = {
  Order: number;
  Enabled: boolean;
  CreditCardEnabled: boolean;
  BankEnabled: boolean;
}

export type AccountConfigurationPlans = {
  Order: number;
  Enabled: boolean;
  AllowMultiplePlans: boolean;
  Hardware: AccountConfigurationDefaultItem;
  Charges: AccountConfigurationDefaultItem;
  Discounts: AccountConfigurationDefaultItem;
}

export type AccountConfigurationDetails = {
  AccountId: {
    Method: 'Manual' | 'Automatic' | 'AutomaticAndManual';
  },
  SubType: AccountConfigurationDefaultItem;
  Aliases: AccountConfigurationDefaultItem;
  Status: AccountConfigurationDefaultItem;
  Key: AccountConfigurationDefaultItem;
  EnquiryPassword: AccountConfigurationDefaultItem;
  ContactPhones: AccountConfigurationDefaultItem;
  Emails: AccountConfigurationDefaultItem;
  Addresses: AccountConfigurationDefaultItem;
}

export type AccountConfiguration = {
  Details: AccountConfigurationDetails;
  Options: AccountConfigurationOptions;
  PaymentMethods: AccountConfigurationPaymentMethods;
  Plans: AccountConfigurationPlans;
  Attributes: AccountConfigurationDefaultItem;
  Contracts: AccountConfigurationDefaultItem;
  Sites: AccountConfigurationDefaultItem;
  CostCenters: AccountConfigurationDefaultItem;
  ServiceGroups: AccountConfigurationDefaultItem;
  Charges: AccountConfigurationDefaultItem;
  Identification: AccountConfigurationDefaultItem;
  RelatedContacts: AccountConfigurationDefaultItem;
  Documents: AccountConfigurationDefaultItem;
  Notifications: AccountConfigurationDefaultItem;
  Authentication: AccountConfigurationDefaultItem;
}