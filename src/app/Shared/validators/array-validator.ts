import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function ArrayValidator(type: 'email' | 'phone'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {    
    if (!control.value || !Array.isArray(control.value)) {
      return null;
    } else {
      let regExp: RegExp;
      switch (type) {
        case 'email':
          regExp = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
          break;
        case 'phone':
          regExp = /^[0-9][A-Za-z0-9 -]*$/;
          break;
        default:
          break;
      }

      return control.value.every(s => regExp.test(s)) ? null : { invalid: true };
    }
  };
}