import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SignInService } from './signin.service';


@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(
        private auth: SignInService,
        private router: Router,
    ) {
    }

    canActivate() {
        if (this.auth.loggedIn()) {
            return true;
        } else {
            this.router.navigate(['/auth/signin']);
            return false;
        }
    }
}
