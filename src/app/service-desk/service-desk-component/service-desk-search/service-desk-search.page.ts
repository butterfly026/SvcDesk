import { Component, OnInit, Output, EventEmitter, Input, ViewChild, Inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranService, LoadingService, ToastService } from 'src/services';

import { ServiceDeskService } from '../../service-desk/services/service-desk.service';
import { NewContactSearch, SearchCookieData, TokenInterface, Token_config } from 'src/app/model';
import * as $ from 'jquery';
import { GlobalService } from 'src/services/global-service.service';
import { AdvancedSearchService } from '../advanced-search/services/advanced-search.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { ServiceDeskSearchService } from './services/service-desk-search.service';

@Component({
  selector: 'app-service-desk-search',
  templateUrl: './service-desk-search.page.html',
  styleUrls: ['./service-desk-search.page.scss'],
})
export class ServiceDeskSearchPage implements OnInit {

  @Input() InputSearch: NewContactSearch = {
    statuscode: null,
    recordcount: null,
    errormessage: null,
    items: []
  };
  @Output('ServiceDeskSearchComponent') ServiceDeskSearchComponent: EventEmitter<string> = new EventEmitter<string>();


  searchData: string = '';

  SkipRecords = 0;
  TakeRecords = 10;
  stepCount = 1;
  pageNumber = 1;

  selectedIndex = 1;

  pageList: Array<number> = [];

  backSymbol = '⮜';
  forwardSymbol = '⮞';

  searchResult: any = [];

  recordCount: number = 0;
  enableNext: number = 0;

  searchForm: UntypedFormGroup;
  searchList: any[] = [];
  filteredOptions: any[] = [];


  searchOptionsExpanded: boolean = false;
  showSearchOptions: boolean = true;
  showSearchOptionsDiv: boolean = false;
  showAdvanced: boolean = true;
  optionSearchForAccounts: boolean = false;
  optionAutoOpenIfFindOne: boolean = false;

  SEARCH_ITEM_KEY: 'searchItems';

  cookieData: SearchCookieData;

  constructor(
    public navCtrl: NavController,
    private tranService: TranService,
    private loading: LoadingService,
    private toast: ToastService,
    private cookieService: CookieService,

    private cCareService: ServiceDeskService,
    public globService: GlobalService,
    private searchService: ServiceDeskSearchService,
    private advancedSearchService: AdvancedSearchService,
    private formBuilder: UntypedFormBuilder,
    @Inject(Token_config) public tokens: TokenInterface,
  ) {
    this.tranService.translaterService();

    this.searchForm = this.formBuilder.group({
    });
    this.searchForm.addControl('searchCtrl', new UntypedFormControl(''));
  }

  async ngOnInit() {
    await this.getSearchOptions();
    await this.getPermission();

  }

  // private formatPermissions(value: Permission[]): void {
  //   this.permissions = value.map(s => s.Resource.replace('/UsageTransactions/Services/History', "").replace('/', "") as PermissionType);
  // }
  private async getPermission(): Promise<void> {
    await this.loading.present();
    this.globService.getAuthorization('/Search', true)
      .subscribe({
        next: async (_result) => {
          await this.loading.dismiss();
          if (!_result || _result.length == 0) {
            this.tranService.errorMessage('resource_forbidden');
            setTimeout(() => {
              this.goBack();
            }, 1000);
          } else {
            let bForbidden = true;
            this.cookieData = this.getCookieData(this.SEARCH_ITEM_KEY);
            if (!this.cookieData) {
              this.initCookieData();
              this.cookieData.isInitialData = true;
            }
            _result.forEach(perm => {
              if (perm.Resource == '/Search/Advanced') {
                this.showAdvanced = true;
                this.cookieData.showAdvanced = true;
              } else if (perm.Resource == '/Search/Personalisation') {
                this.showSearchOptions = true;
                this.cookieData.showSearchOptions = true;
              } else if (perm.Resource == '/Search') {
                bForbidden = false;
                this.cookieData.bForbidden = true;
              }
            });
            if (bForbidden) {
              this.tranService.errorMessage('resource_forbidden');
              setTimeout(() => {
                this.goBack();
              }, 1000);
            } else {
              this.initialize();
            }
          }
        },
        error: async (err) => {
          await this.loading.dismiss();
          const errResult = this.globService.ConvertKeysToLowerCase(err);
          this.tranService.errorMessage('resource_forbidden');

          if (errResult.errorcode === 403 || errResult?.status === 403 || errResult.error?.errorcode === 403) {
            setTimeout(() => {
              this.goBack();
            }, 1000);
          }
        }
      });
  }

  initialize() {
    if (!this.cookieData.isInitialData) {
      this.getCookieParameters();
    }


    if (localStorage.getItem('searchArray')) {
      this.searchList = JSON.parse(localStorage.getItem('searchArray'));
    } else {
      this.searchList = [];
    }

    this.filteredOptions = this.filter('');

    this.searchForm.get('searchCtrl').valueChanges.subscribe((result: any) => {
      this.filteredOptions = this.filter(result);
    });

    if (!this.cookieData.isInitialData && this.cookieData.isSearched) {
      this.searchSubmit(true);
    }
  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.searchList.filter(option => option.toLowerCase().includes(filterValue));
  }


  searchSubmit(isFromCookie?: boolean) {
    if (!isFromCookie) {
      this.InputSearch.items = [];
      this.stepCount = 1;
      this.SkipRecords = 0;
      this.pageNumber = 1;
      this.setPageList();
      this.getSearchResult();
    } else {
      if (this.cookieData.isInitialData) {
        this.InputSearch.items = [];
        this.stepCount = 1;
        this.SkipRecords = 0;
        this.pageNumber = 1;
        this.setPageList();
        this.getSearchResult();
      } else {
        this.InputSearch.items = this.cookieData.inputSearch.items;
        this.stepCount = this.cookieData.stepCount;
        this.SkipRecords = this.cookieData.skipRecords;
        this.pageNumber = this.cookieData.pageNumber;
        this.setPageList();
        this.getSearchResult();
      }
    }

  }

  clearSearch() {
    this.searchForm.get('searchCtrl').setValue('');
    this.deleteDataFromCookie(this.SEARCH_ITEM_KEY);
  }

  get f() {
    return this.searchForm.controls;
  }

  availAddSearchArray(searchArray) {
    for (let list of searchArray) {
      if (list === this.searchForm.get('searchCtrl').value) {
        return false;
      }
    }

    return true;
  }

  private async getSearchOptions() {
    await this.loading.present();
    this.searchService.getPersonalisationConfig().subscribe(async (result) => {
      await this.loading.dismiss();
      if (result) {
        this.optionSearchForAccounts = result.AccountsOnly;
        this.optionAutoOpenIfFindOne = result.AutomaticallyLoadSingleResult;
      }
    }, async (error: any) => {
      await this.loading.dismiss();

      this.tranService.errorMessage(error);
    });
  }



  async getSearchResult() {
    if (this.InputSearch.items.length === 0) {
      await this.loading.present();
      const reqPara = {
        'search': '*' + this.searchForm.get('searchCtrl').value + '*',
        'AccountsOnly': this.optionSearchForAccounts,
        'SkipRecords': this.SkipRecords,
        'TakeRecords': this.TakeRecords
      };
      let searchArray = JSON.parse(localStorage.getItem('searchArray'));
      if (searchArray) {
        if (searchArray.length < 21) {
          if (this.availAddSearchArray(searchArray)) {
            searchArray.push(this.searchForm.get('searchCtrl').value);
          }
        } else {
          if (this.availAddSearchArray(searchArray)) {
            searchArray.splice(0, 1);
            searchArray.push(this.searchForm.get('searchCtrl').value);
          }
        }
        localStorage.setItem('searchArray', JSON.stringify(searchArray));
      } else {
        searchArray = [this.searchForm.get('searchCtrl').value];
        localStorage.setItem('searchArray', JSON.stringify(searchArray));
      }

      this.searchList = searchArray;

      this.searchResult = new Array();
      this.cCareService.getContactSearch(this.globService.convertRequestBody(reqPara)).subscribe(async (result: NewContactSearch) => {

        await this.loading.dismiss();
        let convertResult = this.globService.ConvertKeysToLowerCase(result);
        this.recordCount = convertResult.recordcount;
        this.setPageList();
        if (convertResult.items === null) {
          this.tranService.errorMessage('no_customers');
        } else if (convertResult.items.length === 0) {
          this.tranService.errorMessage('nothing_found');

        } else {
          let convertedArray = convertResult.items;
          for (const list of convertedArray) {
            const temp = {
              ContactSearch: list, expanded: false
            };
            this.searchResult.push(temp);
          }
          if (convertedArray.length == 1 && this.showSearchOptions && this.optionAutoOpenIfFindOne) {
            this.addTabs(0);
          }
        }
        this.setCookieParameters();
        this.setContactCodeTitle();
      }, async (error: any) => {
        await this.loading.dismiss();

        this.tranService.errorMessage(error);
      });
    } else {
      await this.loading.present();
      const reqPara = {
        'SkipRecords': this.SkipRecords,
        'TakeRecords': this.TakeRecords
      };
      let advancedSubmit = JSON.parse(localStorage.getItem('advancedForm'));

      let newSubmit = advancedSubmit;
      for (var key in newSubmit) {
        if (this.checkEmptyValue(newSubmit[key])) {

        } else {
          delete newSubmit[key];
        }
      }
      this.searchResult = new Array();
      this.advancedSearchService.ContactSearchAdvanced(reqPara, newSubmit).subscribe(async (result: NewContactSearch) => {

        await this.loading.dismiss();
        let convertResult = this.globService.ConvertKeysToLowerCase(result);
        this.recordCount = convertResult.recordcount;
        let convertedArray = convertResult.items;
        for (const list of convertedArray) {
          const temp = {
            ContactSearch: list, expanded: false
          };
          this.searchResult.push(temp);
        }
        this.setContactCodeTitle();
        this.setPageList();
        this.setCookieParameters();
        if (convertedArray.length == 1 && this.showSearchOptions && this.optionAutoOpenIfFindOne) {
          this.addTabs(0);
        }
      }, async (error: any) => {
        await this.loading.dismiss();

        this.tranService.errorMessage(error);
      });
    }
  }

  removeSearch(index, event) {
    event.stopPropagation();
    this.searchList.splice(index, 1);
    localStorage.setItem('searchArray', JSON.stringify(this.searchList));
    // this.filteredOptions = this.searchForm.get('searchCtrl')
    //   .valueChanges.pipe(startWith(''), map(value => this.filter(value)));

    this.filteredOptions = this.filter('');
  }

  checkEmptyValue(value) {
    if (value === '' || value === null || typeof (value) === 'undefined' || ((value[0] === '' || value[0] === null) && value.length === 1)) {
      return false;
    }
    return true;
  }

  toggleSearchOptions() {
    this.showSearchOptionsDiv = !this.showSearchOptionsDiv;
  }

  switchContactSearch() {
    this.ServiceDeskSearchComponent.emit('SwitchContactSearch');
  }

  openExpantion(index) {
    this.searchResult[index].expanded = true;
  }

  callapsExpantion(index) {
    this.searchResult[index].expanded = false;
  }

  addTabs(index) {
    this.ServiceDeskSearchComponent.emit('SelectServiceDesk' + this.removeSpace(this.searchResult[index].ContactSearch.contactcode));
  }

  previousPageStep() {
    if (this.stepCount > 1) {
      this.stepCount = this.stepCount - 1;
      // this.pageNumber = (this.stepCount - 1) * this.TakeRecords;
      this.pageNumber = ((this.stepCount - 1) * this.TakeRecords) + 1;
      this.SkipRecords = this.pageNumber * this.TakeRecords;
      this.setPageList();
      this.getSearchResult();
    }
  }

  nextPageStep() {
    if (this.recordCount !== null) {
      if ((this.stepCount) * this.TakeRecords < Math.ceil(this.recordCount / 10)) {
        this.stepCount = this.stepCount + 1;
        this.pageNumber = ((this.stepCount - 1) * this.TakeRecords) + 1;
        this.SkipRecords = this.pageNumber * this.TakeRecords;
        this.setPageList();
        this.getSearchResult();
      }
    }
  }

  setPageList() {
    this.enableNext = Math.ceil(this.recordCount / 10);
    this.pageList = [];
    if (this.recordCount !== null) {
      let totalPage = Math.ceil(this.recordCount / 10);
      if (totalPage === 1) {
      } else {
        if (totalPage > (this.stepCount - 1) * this.TakeRecords) {
          if (totalPage > this.stepCount * this.TakeRecords) {
            for (let i = (this.stepCount - 1) * this.TakeRecords; i < (this.stepCount) * this.TakeRecords; i++) {
              this.pageList.push(i + 1);
            }
          } else {
            for (let i = (this.stepCount - 1) * this.TakeRecords; i < totalPage; i++) {
              this.pageList.push(i + 1);
            }
          }
        }
      }
    }
  }

  selectPage(list) {
    if (this.pageNumber !== list) {
      this.pageNumber = list;
      this.SkipRecords = (this.pageNumber - 1) * this.TakeRecords;
      this.getSearchResult();
    }
  }

  goBack() {
    this.ServiceDeskSearchComponent.emit('close');
  }

  removeSpace(value: string) {
    return value.replace(/ /g, '');
  }

  setContactCodeTitle() {
    const contactLists = $('.service-desk-contact');
    if (contactLists === null || typeof (contactLists) === 'undefined' || contactLists.length === 0) {
      setTimeout(() => {
        this.setContactCodeTitle();
      }, 200);
    } else {
      let maxWidth = 0;
      for (let i = 0; i < contactLists.length; i++) {
        if (maxWidth < $(contactLists[i]).width()) {
          maxWidth = $(contactLists[i]).width();
        }
      }
      for (let i = 0; i < contactLists.length; i++) {
        $(contactLists[i]).width(maxWidth);
      }
    }
  }

  processSearchOptions(res: String) {
    let optionName = res.split('&')[0];
    let optionFlag = res.split('&')[1];
    if (optionName == 'SearchForAccounts') {
      this.optionSearchForAccounts = optionFlag == 'true';
    } else if (optionName == 'AutoOpenIfFindOne') {
      this.optionAutoOpenIfFindOne = optionFlag == 'true';
    }
  }

  initCookieData(): void {
    this.cookieData = {
      isInitialData: true,
      showAdvanced: false,
      showSearchOptions: false,
      bForbidden: false,
      inputSearch: {
        statuscode: 0,
        recordcount: 0,
        errormessage: '',
        items: []
      },
      searchString: '',
      optionSearchForAccounts: false,
      userName: '',
      isSearched: false,

      stepCount: 1,
      skipRecords: 0,
      takeRecords: 10,
      pageNumber: 1,
      recordCount: 0,
      selectedIndex: 0,
    }
  }

  setCookieParameters(): void {
    this.cookieData.inputSearch = this.InputSearch;
    this.cookieData.pageNumber = this.pageNumber;
    this.cookieData.skipRecords = this.SkipRecords;
    this.cookieData.takeRecords = this.TakeRecords;
    this.cookieData.stepCount = this.stepCount;
    this.cookieData.recordCount = this.recordCount;
    this.cookieData.optionSearchForAccounts = this.optionSearchForAccounts;
    this.cookieData.searchString = this.searchForm.get('searchCtrl').value;
    this.cookieData.isInitialData = false;
    this.cookieData.isSearched = true;
    this.cookieData.userName = this.tokens.UserCode;
    this.cookieData.selectedIndex = this.selectedIndex;
    this.setDataToCookie(this.SEARCH_ITEM_KEY, this.cookieData);
  }

  getCookieParameters(): void {
    if (this.cookieData.userName != this.tokens.UserCode) {
      this.initCookieData();
      this.deleteDataFromCookie(this.SEARCH_ITEM_KEY);
      return;
    }
    this.InputSearch = this.cookieData.inputSearch;
    this.pageNumber = this.cookieData.pageNumber;
    this.SkipRecords = this.cookieData.skipRecords;
    this.TakeRecords = this.cookieData.takeRecords;
    this.stepCount = this.cookieData.stepCount;
    this.recordCount = this.cookieData.recordCount;
    this.selectedIndex = this.cookieData.selectedIndex;
    this.optionSearchForAccounts = this.cookieData.optionSearchForAccounts;
    this.searchForm.get('searchCtrl').setValue(this.cookieData.searchString);
  }

  setDataToCookie(key: string, data: any): void {
    this.cookieService.set(key, JSON.stringify(data));
  }

  getCookieData(key: string): any {
    if (!this.cookieService.check(key)) return null;
    return JSON.parse(this.cookieService.get(key));
  }

  deleteDataFromCookie(key: string): any {
    this.cookieService.deleteAll(key);
  }
}
