export type StatusCount = {
  Count: number;
  Status: 'Disconnected' | 'Active';
  StatusCode: 'OPEN' | 'DIS'
}

export type ServiceTypeDetail = {
  Count: number;
  DisplayOrder: number;
  Icon: string;
  InstanceMenuId: number;
  MenuId: number;
  ServiceType: string;
  ServiceTypeCode: string;
  StatusCounts: StatusCount[] | string;
}

export type GetServiceTypesResponse = {
  Count: number;
  ServiceTypeNodes: ServiceTypeDetail[];
}