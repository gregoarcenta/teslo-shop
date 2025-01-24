import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { emailFormatValidator } from '@/shared/validators/email-format.validator';
import { ToastService } from '@/core/services/toast.service';
import { FlowbiteService } from '@/core/services/flowbite.service';
import { strongPasswordValidator } from '@/shared/validators/strong-password.validator';
import { initDropdowns, initTooltips } from 'flowbite';
import { RegisterService } from '@/core/services/register.service';

interface IRegisterForm {
  fullName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  terms: FormControl<boolean>;
}

type registerFormProps = keyof IRegisterForm;

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterComponent {
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly registerService = inject(RegisterService);
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly nnFormBuilder = inject(NonNullableFormBuilder);

  public isLoading = signal<boolean>(false);

  public registerForm = this.nnFormBuilder.group<IRegisterForm>({
    fullName: this.nnFormBuilder.control('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: this.nnFormBuilder.control('', [
      Validators.required,
      emailFormatValidator(),
    ]),
    password: this.nnFormBuilder.control('', [
      Validators.required,
      strongPasswordValidator(),
    ]),
    terms: this.nnFormBuilder.control(false, [Validators.requiredTrue]),
  });

  get getFullNameError(): string {
    const control = this.registerForm.controls['fullName'];
    if (control.getError('required')) {
      return 'Full name is required';
    }
    if (control.getError('minlength')) {
      return 'Please enter a name with at least 3 characters';
    }
    return '';
  }

  get getEmailError(): string {
    const control = this.registerForm.controls['email'];
    if (control.getError('required')) {
      return 'Email is required';
    }
    if (control.getError('invalidFormat')) {
      return 'Please enter a valid email';
    }
    return '';
  }

  get getPasswordError(): string {
    const control = this.registerForm.controls['password'];
    if (control.getError('required')) {
      return 'Password is required';
    }
    if (control.getError('strongPassword')) {
      return 'Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, and one number';
    }
    return '';
  }

  get getTermsError(): string {
    const control = this.registerForm.controls['terms'];
    if (control.getError('required')) {
      return 'You must accept the terms and conditions';
    }

    return '';
  }

  isInvalid(campo: registerFormProps): boolean {
    return (
      this.registerForm.controls[campo].touched &&
      this.registerForm.controls[campo].invalid
    );
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return this.registerForm.markAllAsTouched();
    }

    this.isLoading.set(true);

    const { terms, ...params } = this.registerForm.getRawValue();

    this.registerService.createAccount(params).subscribe({
      next: (res) => {
        this.registerForm.reset();
        this.registerForm.markAsUntouched();
        this.isLoading.set(false);
        this.router.navigateByUrl('/').then((success) => {
          if (success) {
            this.flowbiteService.loadFlowbite(() => {
              initDropdowns();
              initTooltips();
            });
            this.toastService.showToast(res, 'success');
          }
        });
      },
      error: ({ error }) => {
        this.isLoading.set(false);
        if (error.message.includes('already exists')) {
          this.toastService.showToast(
            `Email "${this.registerForm.value.email}" already exists`,
            'error',
            false,
          );
          return;
        }
        this.toastService.showToast(error.message, 'error', false);
      },
    });
  }
}
