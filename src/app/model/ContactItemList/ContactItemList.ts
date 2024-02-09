import { MenuSimpleWebItem } from '../MenuSimpleWebItem/MenuSimpleWebItem';

export interface ContactItemList {
    Key: string,
    Label: string,
    Value: string,
    MenuId: string,
    DataType: string,
    IconURL: string,
    Tooltip: string,
    DisplayOrder: number,
    DisplayBold: boolean,
    DisplayColor: string,
    DisplayGroup: string,
    NavigationPath: string,
    EditType: number,
    APIURL: string,
    AttributeType: string,
    AttributeDataType: number,
    AttributeKey: string,
    AttributeValue: string,
    MenuItems: [
        MenuSimpleWebItem
    ],
    ObjectId: 0
}
