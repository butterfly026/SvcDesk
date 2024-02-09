import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { LoadingService, ToastService, TranService } from 'src/services';
import { GlobalService } from 'src/services/global-service.service';


@Component({
  selector: 'app-add-contract',
  templateUrl: './add-contract.page.html',
  styleUrls: ['./add-contract.page.scss'],
})
export class AddContractPage implements OnInit, OnDestroy {

  pageTitle: string = '';


  contactForm: UntypedFormGroup;
  contactMode: string = '';
  contactDetail: any;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,

    private tranService: TranService,
    private loading: LoadingService,
    private formBuilder: UntypedFormBuilder,
    private navCtrl: NavController,
    private toast: ToastService,
    public globService: GlobalService,
  ) {
    this.contactMode = this.activateRoute.snapshot.params['type'];


    this.tranService.translaterService();
    this.contactForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{8,}')]],
    });
    this.contactDetail = this.globService.PasswordInformation;
  }

  async ngOnInit() {
    if (this.contactMode == 'email') {
      this.pageTitle = await this.tranService.convertText('email').toPromise();
      this.contactForm.removeControl('phone');
    } else if (this.contactMode === 'phone') {
      this.pageTitle = await this.tranService.convertText('phone_number').toPromise();
      this.contactForm.removeControl('email');
    }
  }

  ngOnDestroy() {
  }

  get f() {
    return this.contactForm.controls;
  }

  async addNewContract() {
    if (this.contactForm.valid) {
      if (this.contactMode === 'email') {
        const toastMessage = await this.tranService.convertText('email_register_confirmation').toPromise();
        this.toast.present(toastMessage);
      } else if (this.contactMode === 'phone') {

      }

      this.navCtrl.navigateRoot(['ServiceDesk']);
    }
  }

  triggerSubmit() {
    document.getElementById('submitButton').click();
  }

  goBack() {
    if (this.contactDetail.mustRegister && this.contactDetail.mustRegister === 'must') {
    } else {
      this.navCtrl.navigateForward(['ServiceDesk']);
      // this.navCtrl.pop();
    }
  }

}
