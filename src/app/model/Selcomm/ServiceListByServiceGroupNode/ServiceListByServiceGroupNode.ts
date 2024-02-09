import { ServiceWithType } from '../ServiceWithType/ServiceWithType';

export interface ServiceListByServiceGroupNode {
    ServiceGroupId: number,
    ServiceGroup: string,
    Count: number,
    Services: ServiceWithType[]
}
