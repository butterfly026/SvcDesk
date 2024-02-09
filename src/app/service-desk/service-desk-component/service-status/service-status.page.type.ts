export type StatusDetail = {
  Count: number;
  Id: string;
  Status: 'Active' | 'Disconnected'
}

export type GetStatusNodesResponse = {
  Count: number;
  StatusNodes: StatusDetail[];
}