import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/** An actor's name can't match the given regular expression */
export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasMinLength = value.length >= 6;
    const passwordValid =
      hasUpperCase && hasLowerCase && hasNumeric && hasMinLength;
    return !passwordValid ? { strongPassword: true } : null;
  };
}
