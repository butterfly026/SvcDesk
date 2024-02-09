export type SiteDetail = {
  Id: number;
}

export type GetSitesResponse = {
  Count: number;
  SiteNodes: SiteDetail[];
}