import { type } from "os";

export type ContractItemDetail = {
    Id: string,
    Penalty: string,
    Extensions: ExtensionItemDetail[],
    Service: boolean,
    Contact: boolean,
    CoolOffDays: number,
    PenaltyPercentage: number,
    PenaltyId: string,
    DisconnectionFee: number,
    DisconnectionUnit: string,
    Disconnection: number,
    TermUnit: string,
    Term: number,
    Name: string,
    CreatedBy: string,
    Created: Date,
    UpdatedBy: string
    LastUpdated: Date,
}

export type ContractItem = {
    Id: string,
    Name: string,
    Term: number,
    TermUnit: string,
    Disconnection: number,
    DisconnectionUnit: string,
    DisconnectionFee: number,
    PenaltyId: string,
    PenaltyPercentage: number,
    CoolOffDays: number,
    Contact: boolean,
    Service: boolean,
    Extensions: ExtensionItem[],
}

export type TermUnit = 'Month' | 'Year';
export type DisconnectionUnit = 'Month' | 'Year';

export type ExtensionItemDetail = {
    Id: string,
    Name: string,
    Discount: number,
    Term: number,
    Commission: number,
    From: Date,
    To: Date,
    CreateBy: string,
    Created: Date,
    UpdatedBy: string,
    LastUpdated: Date,
}

export type ExtensionItem = {
    Id: string,
    Name: string,
    Discount: number,
    Term: number,
    Commission: number,
    From: Date,
    To: Date,
}

export type ContractsItemResponse = {
    Count: number,
    Contracts: ContractItemDetail[],
}

export class ContractOption {
    Account: boolean = false;
    Service: boolean = true; 
}