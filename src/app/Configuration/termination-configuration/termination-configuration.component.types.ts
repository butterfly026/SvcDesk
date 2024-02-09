export type TerminationConfiguration = {
    PayOutOverride: {
        Enabled: boolean,
        Minimum: number,
        Maximum: number
    },
    NetworkOptions: {
        CloseNetworkEvent: {
            Enabled: boolean,
            Default: boolean
        },
        CancelOpenEvents: {
            Enabled: boolean,
            Default: boolean
        }
    },
    ChargeOptions: {
        CreditBackFutureCharges: {
            Enabled: boolean,
            Default: boolean
        },
        BillFutureCharges: {
            Enabled: boolean,
            Default: boolean
        },
        UnloadFutureUsage: {
            Enabled: boolean,
            Default: boolean
        }
    },
    BulkApplyOptions: {
        ApplyAll: {
            Enabled: boolean,
            Default: boolean
        },
        ApplySameServiceType: {
            Enabled: boolean,
            Default: boolean
        },
        ApplyChildren: {
            Enabled: boolean,
            Default: boolean
        },
        ApplySiblings: {
            Enabled: boolean,
            Default: boolean
        }
    }
};