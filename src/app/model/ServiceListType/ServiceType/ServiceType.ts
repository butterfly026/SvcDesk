import { StatusCounts } from '../StatusCounts/StatusCounts';
import { Services } from '../Services/Services';

export interface ServiceType {
    ServiceTypeCode: string,
    ServiceType: string,
    Icon: string,
    MenuId: number,
    InstanceMenuId: number,
    DisplayOrder: number,
    Count: number,
    StatusCounts: StatusCounts[],
    Services: Services[]
}
