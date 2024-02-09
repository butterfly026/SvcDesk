import { Injectable, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from './toast.service';
import { TokenInterface, Token_config, } from 'src/app/model';
import { Router } from '@angular/router';
import { AlertService } from './alert-service.service';
import { GlobalService } from './global-service.service';

@Injectable({
    providedIn: 'root'
})
export class TranService {

    private contactStr: string = '';
    private errorText: string = '';

    constructor(
        public translate: TranslateService,
        private toast: ToastService,
        private alert: AlertService,

        @Inject(Token_config) public tokens: TokenInterface,
        private router: Router,
        public globService: GlobalService,
    ) {
        this.translate.addLangs(['en', 'ru']);
        this.translate.get('error').subscribe(result => {
            this.errorText = result;
        });
    }

    translaterService() {
        if (typeof (localStorage.getItem('set_lng')) === 'undefined' || localStorage.getItem('set_lng') === '' || localStorage.getItem('set_lng') === null) {
            localStorage.setItem('set_lng', 'en');
            this.translate.use('en');
        } else {
            this.translate.use(localStorage.getItem('set_lng'));
        }
    }

    convertText(value) {
        return this.translate.get(value);
    }

    setLang(lang) {
        this.translate.use(lang);
    }

    instant(val: string): string {
        return this.translate.instant(val);
    }

    async errorMessage(err) {
        console.log('err', err);
        let text = '';
        let code = '';
        let errorData = this.globService.ConvertKeysToLowerCase(err);
        const error = errorData.error;      
        if (typeof (errorData.status) !== 'undefined') {
            if (error && error.errorcode && error.errormessage) {
                if (error.errorcode === null) {
                    code = '';
                } else {
                    code = error.errorcode;
                }
                if (error.errormessage === null) {
                    text = '';
                } else {
                    text = error.errormessage;
                }

                if (code.toString() === '500') {
                    this.convertText('500_handle_error_message').subscribe(value => {
                        this.toast.present(value);
                    });
                } else {
                    this.toast.present(text);

                    if (code.toString() === '401') {
                        this.tokens.AccessToken = '';
                        this.router.navigate(['/auth/signin']);
                    }
                }
            } else {
                if (errorData.status === null) {
                    code = '';
                } else {
                    code = errorData.status;
                }

                if (code.toString().charAt(0) !== '2') {
                    if (code.toString() === '500') {
                        this.convertText('500_handle_error_message').subscribe(value => {
                            this.toast.present(value);
                            this.alert.HandleServerError(value + ' ' + code.toString() + this.errorText);
                        });
                    } else {

                        if (code.toString() === '401') {
                            this.tokens.AccessToken = '';
                            this.router.navigate(['/auth/signin']);
                        } else if (code.toString() === '403') {
                            const title = await this.translate.get('sign_in_failed').toPromise();

                            this.translate.get('contact_system_administrator').subscribe(result => {
                                this.contactStr = result + ' - ' + code.toString() + ' ' + this.errorText;
                                this.alert.presentAlert(title, this.contactStr);
                            });

                            this.toast.present(title);

                        } else {
                            this.translate.get(code.toString()).subscribe(result => {
                                this.toast.present(result);
                            })

                            this.translate.get('contact_system_administrator').subscribe(result => {
                                this.contactStr = result + ' - ' + code.toString() + ' ' + this.errorText;
                                this.alert.presentAlert(text, this.contactStr);
                            });
                        }
                    }
                }
            }
        } else if (errorData.error) {
            if (typeof (error.type) !== undefined && error.type === 'error') {
                // detect bad internet
                // this.alert.presentAlert("Network is currently unavailable, please try again later.");
                this.convertText('n_i_c_u_try_again').subscribe(text => {
                    this.convertText('oops').subscribe(title => {
                        this.alert.presentAlert(title, text);
                    })
                })
            }
            if (typeof (errorData.successful) !== 'undefined') {
                if (errorData.successful === null) {
                    code = '';
                } else {
                    code = errorData.successful;
                }
                if (errorData.errormessage === null) {
                    text = '';
                } else {
                    text = errorData.errormessage;
                }

                if (code.toString() === '500') {
                    this.convertText('500_handle_error_message').subscribe(value => {
                        this.toast.present(value);
                        this.alert.HandleServerError(value);
                    });
                } else {
                    this.toast.present(text);

                    this.translate.get('contact_system_administrator').subscribe(result => {
                        this.contactStr = result + ' - ' + code.toString() + ' ' + this.errorText;
                        this.alert.presentAlert(text, this.contactStr);
                    });

                    if (code.toString() === '401') {
                        this.tokens.AccessToken = '';
                        this.router.navigate(['/auth/signin']);
                    }
                }
            }

            if (typeof (error.errorcode) !== 'undefined') {
                if (error.errorcode === null) {
                    code = '';
                } else {
                    code = error.errorcode;
                }
                if (error.errormessage === null) {
                    text = '';
                } else {
                    text = error.errormessage;
                }

                if (code.toString() === '500') {
                    this.convertText('500_handle_error_message').subscribe(value => {
                        this.toast.present(value);
                        this.alert.HandleServerError(value);
                    });
                } else {
                    this.toast.present(text);

                    this.translate.get('contact_system_administrator').subscribe(result => {
                        this.contactStr = result + ' - ' + code.toString() + ' ' + this.errorText;
                        this.alert.presentAlert(text, this.contactStr);
                    });

                    if (code.toString() === '401') {
                        this.tokens.AccessToken = '';
                        this.router.navigate(['/auth/signin']);
                    }
                }
            }

            if (typeof (error) === 'string') {
                if (error !== '200') {
                    if (error === '204') {
                        this.convertText(error).subscribe(value => {
                            this.toast.present(value);
                            // this.alert.presentAlert(value);
                        });
                    } else if (error === 'creditError') {
                        this.convertText('t_c_c_h_b_declined').subscribe(errormessage => {
                            this.toast.present(errormessage);

                            this.translate.get('contact_system_administrator').subscribe(result => {
                                this.contactStr = result;
                                this.alert.presentAlert(errormessage, this.contactStr);
                            });
                        });
                    } else {
                        this.convertText(error).subscribe(errormessage => {
                            this.toast.present(errormessage);
                        });
                    }
                }
            }

        } else {
            if (typeof (errorData) === 'string') {
                if (errorData !== '200') {
                    if (errorData === '204') {
                        this.convertText(errorData).subscribe(value => {
                            this.toast.present(value);
                        });
                    } else if (errorData === 'creditError') {
                        this.convertText('t_c_c_h_b_declined').subscribe(errormessage => {
                            this.toast.present(errormessage);

                            this.translate.get('contact_system_administrator').subscribe(result => {
                                this.contactStr = result;
                                this.alert.presentAlert(errormessage, this.contactStr);
                            });
                        });
                    } else {
                        this.convertText(errorData).subscribe(errormessage => {
                            this.toast.present(errormessage);
                        });
                    }
                }
            } else {
                if (errorData.status.toString() === '401') {
                    this.clearAllToken();
                    window.location.reload();
                }
            }
        }
    }

    async matErrorMessage(err, alertFunc) {
        let text = '';
        let code = '';
        let errorData = this.globService.ConvertKeysToLowerCase(err);
        const error = errorData.error;      
        if (typeof (errorData.status) !== 'undefined') {
            if (error && error.errorcode && error.errormessage) {
                if (error.errorcode === null) {
                    code = '';
                } else {
                    code = error.errorcode;
                }
                if (error.errormessage === null) {
                    text = '';
                } else {
                    text = error.errormessage;
                }

                if (code.toString() === '500') {
                    this.convertText('500_handle_error_message').subscribe(value => {
                        this.toast.present(value);
                        alertFunc(value, 'Dismiss');
                    });
                } else {
                    this.toast.present(text);
                    alertFunc(code, 'Dismiss', text);

                    if (code.toString() === '401') {
                        this.tokens.AccessToken = '';
                        this.router.navigate(['/auth/signin']);
                    }
                }
            } else {
                if (errorData.status === null) {
                    code = '';
                } else {
                    code = errorData.status;
                }

                if (code.toString().charAt(0) !== '2') {
                    if (code.toString() === '500') {
                        this.convertText('500_handle_error_message').subscribe(value => {
                            this.toast.present(value);
                            alertFunc(value + ' ' + code.toString() + this.errorText, 'Dismiss');                            
                        });
                    } else {

                        if (code.toString() === '401') {
                            this.tokens.AccessToken = '';
                            this.router.navigate(['/auth/signin']);
                        } else if (code.toString() === '403') {
                            const title = await this.translate.get('sign_in_failed').toPromise();

                            this.translate.get('contact_system_administrator').subscribe(result => {
                                this.contactStr = result + ' - ' + code.toString() + ' ' + this.errorText;
                                alertFunc(title, 'OK', this.contactStr);
                            });

                            this.toast.present(title);

                        } else {
                            this.translate.get(code.toString()).subscribe(result => {
                                this.toast.present(result);
                            })

                            this.translate.get('contact_system_administrator').subscribe(result => {
                                this.contactStr = result + ' - ' + code.toString() + ' ' + this.errorText;
                                alertFunc(text, 'OK', this.contactStr);
                            });
                        }
                    }
                }
            }
        } else if (errorData.error) {
            if (typeof (error.type) !== undefined && error.type === 'error') {
                // detect bad internet
                // this.alert.presentAlert("Network is currently unavailable, please try again later.");
                this.convertText('n_i_c_u_try_again').subscribe(text => {
                    this.convertText('oops').subscribe(title => {                        
                        alertFunc(title, 'OK', text);
                    })
                })
            }
            if (typeof (errorData.successful) !== 'undefined') {
                if (errorData.successful === null) {
                    code = '';
                } else {
                    code = errorData.successful;
                }
                if (errorData.errormessage === null) {
                    text = '';
                } else {
                    text = errorData.errormessage;
                }

                if (code.toString() === '500') {
                    this.convertText('500_handle_error_message').subscribe(value => {
                        this.toast.present(value);                        
                        alertFunc(value, 'Dismiss');  
                    });
                } else {
                    this.toast.present(text);

                    this.translate.get('contact_system_administrator').subscribe(result => {
                        this.contactStr = result + ' - ' + code.toString() + ' ' + this.errorText;
                        alertFunc(text, 'OK', this.contactStr);
                    });

                    if (code.toString() === '401') {
                        this.tokens.AccessToken = '';
                        this.router.navigate(['/auth/signin']);
                    }
                }
            }

            if (typeof (error.errorcode) !== 'undefined') {
                if (error.errorcode === null) {
                    code = '';
                } else {
                    code = error.errorcode;
                }
                if (error.errormessage === null) {
                    text = '';
                } else {
                    text = error.errormessage;
                }

                if (code.toString() === '500') {
                    this.convertText('500_handle_error_message').subscribe(value => {
                        this.toast.present(value);                  
                        alertFunc(value, 'Dismiss');  
                    });
                } else {
                    this.toast.present(text);

                    this.translate.get('contact_system_administrator').subscribe(result => {
                        this.contactStr = result + ' - ' + code.toString() + ' ' + this.errorText;
                        alertFunc(text, 'OK', this.contactStr);
                    });

                    if (code.toString() === '401') {
                        this.tokens.AccessToken = '';
                        this.router.navigate(['/auth/signin']);
                    }
                }
            }

            if (typeof (error) === 'string') {
                if (error !== '200') {
                    if (error === '204') {
                        this.convertText(error).subscribe(value => {
                            this.toast.present(value);
                            // this.alert.presentAlert(value);
                        });
                    } else if (error === 'creditError') {
                        this.convertText('t_c_c_h_b_declined').subscribe(errormessage => {
                            this.toast.present(errormessage);

                            this.translate.get('contact_system_administrator').subscribe(result => {
                                this.contactStr = result;
                                alertFunc(errormessage, 'OK', this.contactStr);
                            });
                        });
                    } else {
                        this.convertText(error).subscribe(errormessage => {
                            this.toast.present(errormessage);
                        });
                    }
                }
            }

        } else {
            if (typeof (errorData) === 'string') {
                if (errorData !== '200') {
                    if (errorData === '204') {
                        this.convertText(errorData).subscribe(value => {
                            this.toast.present(value);
                        });
                    } else if (errorData === 'creditError') {
                        this.convertText('t_c_c_h_b_declined').subscribe(errormessage => {
                            this.toast.present(errormessage);

                            this.translate.get('contact_system_administrator').subscribe(result => {
                                this.contactStr = result;
                                alertFunc(errormessage, 'OK', this.contactStr);
                            });
                        });
                    } else {
                        this.convertText(errorData).subscribe(errormessage => {
                            this.toast.present(errormessage);
                            alertFunc(errormessage, 'OK', this.contactStr);
                        });
                    }
                }
            } else {
                if (errorData.status.toString() === '401') {
                    this.clearAllToken();
                    window.location.reload();
                }
            }
        }
    }

    errorMessageWithTime(error) {
        this.convertText(error).subscribe(errormessage => {
            this.toast.presentWithTime(errormessage, 2000);
        });
    }

    errorToastOnly(error) {

        this.convertText(error).subscribe(errormessage => {
            this.toast.present(errormessage);
        });

    }

    specialErrorMessage(error, text) {
        switch (error) {
            case 'creditError':
                this.convertText('t_c_c_h_b_declined').subscribe(errormessage => {
                    this.toast.present(errormessage);

                    this.translate.get('contact_system_administrator').subscribe(result => {
                        this.contactStr = result;
                        this.alert.presentAlert(errormessage, this.contactStr);
                    });
                });
                break;
            case 'noPayment':
                break;
            default:
                break;
        }
    }

    errorToastMessage(message) {
        if (typeof (message) === 'string') {
            if (message !== '200') {
                if (message === '204') {
                    this.convertText(message).subscribe(value => {
                        this.toast.present(value);
                        // this.alert.presentAlert(value);
                    });
                } else if (message === 'creditError') {
                    this.convertText('t_c_c_h_b_declined').subscribe(errormessage => {
                        this.toast.present(errormessage);

                        this.translate.get('contact_system_administrator').subscribe(result => {
                            this.contactStr = result;
                            this.alert.presentAlert(errormessage, this.contactStr);
                        });
                    });
                } else {
                    this.convertText(message).subscribe(errormessage => {
                        this.toast.present(errormessage);
                    });
                }
            }
        }
    }

    clearAllToken() {
        this.tokens.AccessToken = '';
        this.tokens.RefreshToken = '';
        this.tokens.Type = '';
    }

    async customErrorMessage(message,titleKey, statusCode) {
        const title = await this.translate.get(titleKey).toPromise();
        this.translate.get("contact_system_administrator").subscribe(result => {
            this.contactStr = result +". Error:"+ statusCode.toString() + "<br \><br \>"+ message;
            this.alert.presentAlert(title, this.contactStr);
        });

        //this.toast.present(title);
    }
}
