export type StatusCount = {
  Count: number;
  Status: 'Disconnected' | 'Active';
  StatusCode: 'OPEN' | 'DIS'
}

export type CostCenterDetail = {
  Id: number;
  Name: string;
  Code: string;
  Count: number;
  Status: 'Closed' | 'Open';
  StatusCounts: StatusCount[] | string;
}

export type GetCostCenterResponse = {
  Count: number;
  CostCenterNodes: CostCenterDetail[];
}