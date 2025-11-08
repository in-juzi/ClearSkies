import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup;
  errorMessage = signal<string>('');
  loading = this.authService.loading;
  private returnUrl: string;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Get return URL from query params or default to /game
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/game';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.errorMessage.set('');

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // Navigate to the return URL after successful login
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          this.errorMessage.set(
            error.error?.message || 'Login failed. Please check your credentials.'
          );
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);

    if (field?.hasError('required')) {
      return `${this.capitalize(fieldName)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Invalid email format';
    }
    if (field?.hasError('minlength')) {
      return `${this.capitalize(fieldName)} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }

    return '';
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
