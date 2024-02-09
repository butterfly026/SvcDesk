import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent implements OnInit {

  @Input() items: any[] = [];
  @ViewChild('childMenu', { static: true }) public childMenu;

  currentList = [
    // Right side of navigation urls
    { navUrl: '/Contacts/Emails' },
    { navUrl: '/Contacts/Addresses' },
    { navUrl: '/Contacts/Names' },
    { navUrl: '/Contacts/ContactPhones' },
    { navUrl: '/Contacts/Activities' },
    { navUrl: '/Contacts/Notes' },
    { navUrl: '/Contacts/UserDefinedData' },
    { navUrl: '/Accounts/BillOptions' },
    { navUrl: '/Messages/Contacts' },
    { navUrl: '/Messages/Images' },
    { navUrl: '/Accounts/Plans/PlanChange' },
    { navUrl: 'Contacts/customer-service-groups' },
    { navUrl: '/Contacts/EnquiryPassword' },
    { navUrl: '/Contacts/Events/New' },
    { navUrl: '/Accounts/Plans/PlanHistory' },
    { navUrl: '/Accounts/Plans/Update' },
    { navUrl: '/Accounts/Deposits' },
    { navUrl: '/Accounts/Installments' },

    // new tab for the service list
    { navUrl: '/Events/AccountEventHistory' },
    { navUrl: '/Charges/AccountCharges' },
    { navUrl: '/Charges/AccountCharges/New' },
    { navUrl: '/Charges/AccountOverrides' },
    { navUrl: '/Charges/AccountOverrides/New' },
    { navUrl: '/Charges/PriceOverrides/Accounts' },
    { navUrl: '/FinancialTransactions/Transactions' },
    { navUrl: '/FinancialTransactions/Invoices/New' },
    { navUrl: '/FinancialTransactions/Receipts/New' },
    { navUrl: '/FinancialTransactions/CreditAdjustments/New' },
    { navUrl: '/FinancialTransactions/DebitAdjustments/New' },
    { navUrl: '/FinancialTransactions/AutoAllocate/All' },
    { navUrl: '/Accounts/Usage' },
    { navUrl: '/Configrations/Reports/FTP' },
    { navUrl: '/Configurations/SMTP' },
    { navUrl: '/Configurations/Address' },
    { navUrl: '/Configurations/ChangePassword' },
    { navUrl: '/Configurations/PasswordConfiguration' },
    { navUrl: '/Configurations/ResetPassword' },
    { navUrl: '/Accounts/Documents' },
    { navUrl: '/Accounts/CostCenters' },
    { navUrl: '/Events/ServiceEventHistory' },
    { navUrl: '/Events/Services/Events/New' },
    { navUrl: '/Charges/ServiceCharges' },
    { navUrl: '/Charges/ServiceCharges/New' },
    { navUrl: '/Charges/ServiceOverrides' },
    { navUrl: '/Charges/ServiceOverrides/New' },
    { navUrl: '/Services/Plans/PlanHistory' },
    { navUrl: '/Services/Plans/New' },
    { navUrl: '/Services/Plans/PlanChange' },
    { navUrl: '/Services/Usage' },
    { navUrl: '/Services/Terminations/Terminate' },
    { navUrl: '/Charges/Configurations/Groups' },
    { navUrl: '/Services/Documents' },
    { navUrl: '/Services/CostCenters' },
    { navUrl: '/Services/Discounts' },
    { navUrl: '/Services/Attributes' },
    { navUrl: '/Services/New' },
    { navUrl: '/Services/Notes' },
    { navUrl: '/Services/Events' },
    { navUrl: '/Services/Events/New' },
    { navUrl: '/Services/EnquiryPassword' },
    { navUrl: 'BillHistory' },
    { navUrl: '/Bills/Delegations/Accounts' },
    { navUrl: '/Bills/Delegations/New' },
    { navUrl: '/Bills/Delegations/Update' },
    { navUrl: '/Bills/Disputes/Accounts' },
    { navUrl: '/Bills/Disputes/New' },
    { navUrl: '/Bills/Disputes/Update' },
    { navUrl: '/Contacts/customer-service-groups' },
    { navUrl: '/Contacts/PaymentMethods' },
    { navUrl: '/Tasks/Services' },
    { navUrl: '/Tasks/Contacts' },
    { navUrl: '/Tasks/Contacts/New' },
    { navUrl: '/Accounts/Configurations/DepositStatusReasons' },
    { navUrl: '/Users/Authentication' },
    { navUrl: '/Contacts/Identifications' },
    { navUrl: '/Contacts/RelatedContacts' },
    { navUrl: '/Contacts/RelatedContacts/New' },
    { navUrl: '/ttttttttt' },
    { navUrl: '/ttttttttt' },
    { navUrl: '/Services/Suspensions/New' },
    { navUrl: '/Contacts/AuthorisedAccounts' },
    { navUrl: '/Services/Addresses' },
    { navUrl: '/Services/Novations' }
  ]

  constructor(
    public globService: GlobalService,
    private tranService: TranService,
  ) { }

  ngOnInit() {
  }

  goToMenuDetail(index) {
    const navAvailable = this.currentList.filter(it => it.navUrl === this.items[index].navigationurl || 
        (this.items[index].navigationurl.startsWith(it.navUrl) && this.items[index].navigationurl.startsWith('/Tasks/Contacts/New'))).length > 0;
    if (navAvailable) {
      this.globService.globSubject.next(this.items[index].caption + 'Index&&' + index.toString() + 'Index&&'
        + this.items[index].id + 'Index&&' + this.items[index].navigationurl);
    } else {
      this.tranService.errorToastMessage('url_not_available');
    }
  }

}
