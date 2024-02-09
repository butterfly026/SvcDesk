export type StatusCount = {
  Count: number;
  Status: 'Disconnected' | 'Active';
  StatusCode: 'OPEN' | 'DIS'
}

export type ServiceGroupDetail = {
  Id: number;
  Name: string;
  Status: string;
  Count: number;
  StatusCounts: StatusCount[] | string;
}

export type GetServiceGroupsResponse = {
  Count: number;
  ServiceGroupNodes: ServiceGroupDetail[];
}