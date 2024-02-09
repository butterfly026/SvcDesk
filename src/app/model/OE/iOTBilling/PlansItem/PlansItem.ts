export interface PlansItem {
    Id: number,
    Name: string,
    Price: number,
    Description: string,
    Data: {
        Name: string,
        Value: string,
    },
    TalkTime: {
        Name: string,
        Value: string,
    },
    SMS: {
        Name: string,
        Value: string,
    },
    CallerId: {
        Name: string,
        Value: number
    }
}
