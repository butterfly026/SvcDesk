export type NavMenuItem = {
    id: string;
    name: string;
    icon: string;
    order?: number;
    selected?: boolean;
    enabled: boolean;
}

export type NextServiceId = {
    ServiceId: string
}

export type ServiceConfigurationItem = {
    Order: number;
    Enabled: boolean;
}

export type ServiceConfiguration = {
    ServiceQualification: ServiceConfigurationItem;
    Porting: ServiceConfigurationItem;
    ServiceIds: {
        Method: 'Manual' | 'AutomaticPreAllocated' | 'AutomaticPreAllocatedManual' | 'AutomaticPostAllocated',
        Preferrences: {
            Enabled: boolean,
            MaximumNumber: number
        },
        BatchOperations: {
            Enabled: boolean,
            Mode: string,
            SkipExisting: boolean,
            ListMaximum: number,
            RangeNumberMaximum: number
        }
    },
    Status: {
        Enabled: boolean,
        Default: string,
    },
    ConnectionDate: {
        Enabled: boolean,
        DefaultTimeOfDay: string,
        AllowScheduled: boolean,
        AllowPast: boolean
    },
    ServiceEnquiryPassword: boolean,
    Plans: {
        Order: 10,
        Enabled: boolean,
        AllowMultiplePlans: boolean,
        Hardware: {
            Enabled: boolean
        },
        Charges: {
            Enabled: boolean
        },
        Discounts: {
            Enabled: boolean
        }
    },
    Attributes: ServiceConfigurationItem;
    NetworkIdentifiers: ServiceConfigurationItem;
    Features: ServiceConfigurationItem;
    Contracts: ServiceConfigurationItem;
    NetworkElements: ServiceConfigurationItem;
    AdditionalHardware: ServiceConfigurationItem;
    Addresses: ServiceConfigurationItem;
    Sites: ServiceConfigurationItem;
    CostCenters: ServiceConfigurationItem;
    ServiceGroups: ServiceConfigurationItem;
    Charges: ServiceConfigurationItem;
    RelatedContacts: ServiceConfigurationItem;
    Documents: ServiceConfigurationItem;
    Notifications: ServiceConfigurationItem;
}