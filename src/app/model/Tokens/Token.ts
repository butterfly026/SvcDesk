import { InjectionToken } from '@angular/core';

export let Token_config = new InjectionToken('token.config');

export interface TokenInterface {
    UserCode: string;
    ContactCode: string;
    RefreshToken: string;
    AccessToken: string;
    Type: string;
    JwtToken: string;
    Name: string;
}

export const Token: TokenInterface = {
    UserCode: '',
    ContactCode: '',
    RefreshToken: '',
    AccessToken: '',
    Type: '',
    JwtToken: '',
    Name: '',
};
