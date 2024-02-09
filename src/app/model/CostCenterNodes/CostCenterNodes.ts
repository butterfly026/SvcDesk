import { StatusCounts } from '../ServiceListType/StatusCounts/StatusCounts';

export interface CostCenterNodes {
    Id: number,
    Name: string,
    Code: string,
    StatusId: number,
    Status: string,
    Count: number,
    StatusCounts: StatusCounts[]
}