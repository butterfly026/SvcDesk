import { PermissionType } from "src/app/Shared/models"

export type QuestionItem = {
    Id: string,
    QuestionId: number,
    Name: string,
    Answer: string,
}

export type IdentificationItem = {
    Id?: string,
    TypeId: string,
    Name: string,
    Value: string,
    HasExpiryDate: boolean,
    IsCreditCard: boolean,
    HasIssueDate: boolean,
    AllowDuplicates: boolean,
    ExpiryDate?: string,
    IssueDate?: string,
}

export type DialogDataItem = {
    ContactCode: string,
    Permissions: PermissionType[],
    EditMode: string,
    Data?: any,
}