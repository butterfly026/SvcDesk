import { ContactSearchItem } from './ContactSearchItem/ContactSearchItem';

export interface NewContactSearch {
    statuscode: number,
    recordcount: number,
    errormessage: string,
    items: ContactSearchItem[]
}

export interface SearchCookieData {
    isInitialData: boolean,
    showAdvanced: boolean,
    showSearchOptions: boolean,
    bForbidden: boolean,
    inputSearch: NewContactSearch,
    searchString: string,
    optionSearchForAccounts: boolean,
    userName: string,
    isSearched: boolean,

    stepCount: number,
    skipRecords: number,
    takeRecords: number,
    pageNumber: number,
    recordCount: number,
    selectedIndex: number,
}
