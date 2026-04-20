import { Component, inject } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="login()">
      <input
        name="email"
        formControlName="email"
        placeholder="Email"
        required
      />
      <input
        name="password"
        formControlName="password"
        placeholder="Password"
        required
      />
      <button type="submit" [disabled]="loginForm.invalid">login</button>

      @if (errorMessage) {
        <div>{{ errorMessage }}</div>
      }
    </form>
  `,
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  errorMessage: string | null = null;
  private readonly _authService = inject(AuthService);
  private readonly _fb = inject(NonNullableFormBuilder);

  loginForm = this._fb.group<LoginForm>({
    email: this._fb.control('', Validators.required),
    password: this._fb.control('', Validators.required),
  });

  login() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.getRawValue();

    this._authService.login(email, password).subscribe({
      next: () => {
        window.location.href = '/dashboard';
      },
      error: (_error) => {
        this.errorMessage = 'Invalid email or password';
      },
    });
  }
}
