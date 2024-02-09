import { ScheduleDetail } from './ScheduleDetail';

export interface ScheduledReport {
    ID: string,
    End: string,
    Description: string,
    Schedule: Array<number>,
    ScheduleType: string,
    NestedGrid: Array<ScheduleDetail>
}
