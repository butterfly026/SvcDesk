interface Group {
    
    Id: string | number;
    
    ImageURL: string;
    
    Name: string;
    
    Created: Date | string;
    
    CreatedBy: string;
    
    LastUpdated: Date | string;
    
    RestrictedPropertiesNames: any;
    
    UpdatedBy: string;
    
}

export interface MenuItem {
    
    BusinessUnit: string;
    
    Group?: Group;
    
    Id: string | number;
    
    ImageURL: string;
    
    Name: string;
    
    Caption?: string;
    
    Note: string;
    
    Color?: string;
    
    ObjectId: any;
    
    Created: string | Date;
    
    CreatedBy: string;
    
    LastUpdated: string | Date;
    
    Mode?: string;
    
    RestrictedPropertiesNames: any;
    
    UpdatedBy: string;
    
    Command?: string
    
}


export interface SubMenu {
    
    Items: Array<MenuItem>;
    
    TotalFilteredRecords: number;
    
    TotalUnfilteredRecords: number;
    
}
