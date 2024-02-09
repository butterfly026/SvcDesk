export type ContactAliasHistory = {
  Id: number;
  TypeCode: string;
  Type: string;
  Alias: string;
  FromDateTime: string;
  ToDateTime: string;
  CreatedBy: string;
  Created: string;
}

export type ContactsNamesPermissionType = 
  | '' 
  | 'Aliases' 
  | 'Aliases/Delete' 
  | 'Aliases/History' 
  | 'Aliases/History/Download' 
  | 'Aliases/Update' 
  | 'History/Download' 
  | 'History' 
  | 'Update';
