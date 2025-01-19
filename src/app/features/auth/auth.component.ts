import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from '@/core/services/auth.service';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { emailFormatValidator } from '@/shared/validators/email-format.validator';
import { FlowbiteService } from '@/core/services/flowbite.service';
import { initDropdowns } from 'flowbite';
import { Router } from '@angular/router';
import { ToastService } from '@/core/services/toast.service';

interface ILoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

type loginFormProps = keyof ILoginForm;

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule],
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .app-h-100 {
      height: calc(100dvh - 80px);
    }
  `,
})
export default class AuthComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly flowbiteService = inject(FlowbiteService);
  private readonly nnFormBuilder = inject(NonNullableFormBuilder);

  public isLoading = signal<boolean>(false);
  public hasEmailError = signal<boolean>(false);
  public hasPasswordError = signal<boolean>(false);

  public loginForm = this.nnFormBuilder.group<ILoginForm>({
    email: this.nnFormBuilder.control('', [
      Validators.required,
      emailFormatValidator(),
    ]),
    password: this.nnFormBuilder.control('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  constructor() {
    this.loginForm.valueChanges.subscribe(() => {
      if (this.hasEmailError() || this.hasPasswordError()) {
        this.hasEmailError.set(false);
        this.hasPasswordError.set(false);
      }
    });
  }

  get getEmailError(): string {
    const control = this.loginForm.controls['email'];
    if (control.getError('required')) {
      return 'Email is required';
    }
    if (control.getError('invalidFormat')) {
      return 'Please enter a valid email';
    }
    return '';
  }

  get getPasswordError(): string {
    const control = this.loginForm.controls['password'];
    if (control.getError('required')) {
      return 'Password is required';
    }
    if (control.getError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    return '';
  }

  isInvalid(campo: loginFormProps): boolean {
    return (
      this.loginForm.controls[campo].touched &&
      this.loginForm.controls[campo].invalid
    );
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return this.loginForm.markAllAsTouched();
    }

    this.isLoading.set(true);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (res) => {
        this.loginForm.reset();
        this.loginForm.markAsUntouched();
        this.isLoading.set(false);
        this.router.navigateByUrl('/').then((success) => {
          if (success) {
            this.flowbiteService.loadFlowbite(() => initDropdowns());
            this.toastService.showToast(res, 'success');
          }
        });
      },
      error: ({ error }) => {
        this.isLoading.set(false);
        this.toastService.showToast(error.message, 'error', false);

        if (error.message.includes('email')) {
          this.loginForm.controls['email'].markAsTouched();
          this.hasEmailError.set(true);
          const emailInput = document.querySelector(
            '[formControlName="email"]',
          ) as HTMLElement;
          emailInput?.focus();
        }

        if (error.message.includes('password')) {
          this.loginForm.controls['password'].markAsTouched();
          this.hasPasswordError.set(true);
          const passwordInput = document.querySelector(
            '[formControlName="password"]',
          ) as HTMLElement;
          passwordInput?.focus();
        }
      },
    });
  }
}
