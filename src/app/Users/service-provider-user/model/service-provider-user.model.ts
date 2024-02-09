
export type GetServiceProviderUser = {
    SkipRecords: number;
    TakeRecords: number;
    CountRecords?: string;
    SearchString?: string;
    Uninvoiced?: boolean,
  }