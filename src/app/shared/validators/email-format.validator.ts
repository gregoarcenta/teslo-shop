import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/** An actor's name can't match the given regular expression */
export function emailFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regExp =
      /^(?=.{1,256}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$/;

    const validFormat = regExp.test(control.value);

    return validFormat ? null : { invalidFormat: true };
  };
}
