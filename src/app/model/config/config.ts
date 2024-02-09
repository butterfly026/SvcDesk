import { InjectionToken } from '@angular/core';

export let APP_CONFIG = new InjectionToken('app.config');

export interface IAppConfig {
    MockingAPIEndPoint: string;
    APIEndPoint: string;
    APIEndPointNew: string;
    NewAPIEndPoint: string;
}

export const AppConfig: IAppConfig = {
    MockingAPIEndPoint: 'https://virtserver.swaggerhub.com/Selcomm',
    // APIEndPoint: 'https://selcomm.com/SelcommAPI/snapshot/', // Production
    APIEndPoint: 'https://ua.selcomm.com/SelcommAPI/snapshot/', // UA
    // APIEndPointNew: 'https://selcomm.com/SelcommWebApi/', // Production
    APIEndPointNew: 'https://ua-api.selcomm.com', // UA
    NewAPIEndPoint: 'https://ua-api.selcomm.com',
};
