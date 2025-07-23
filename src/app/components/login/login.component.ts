import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-4">
            <div class="mustang-card p-4 fade-in">
              <div class="text-center mb-4">
                <img src="assets/mustang_vetor2.png" alt="Logo Mustang" class="mb-3" style="height: 65px;">
                <h2 class="fw-bold mb-2">Mustang Quiz</h2>
                <p class="text-muted">60 Anos de História</p>
              </div>

              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label fw-semibold">
                    <i class="fas fa-user me-2"></i>Usuário
                  </label>
                  <input 
                    type="text" 
                    class="form-control"
                    id="username"
                    formControlName="username"
                    [class.is-invalid]="isFieldInvalid('username')"
                    placeholder="Digite seu usuário">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('username')">
                    Usuário é obrigatório
                  </div>
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label fw-semibold">
                    <i class="fas fa-lock me-2"></i>Senha
                  </label>
                  <input 
                    type="password" 
                    class="form-control"
                    id="password"
                    formControlName="password"
                    [class.is-invalid]="isFieldInvalid('password')"
                    placeholder="Digite sua senha">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('password')">
                    Senha é obrigatória
                  </div>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-mustang w-100 mb-3"
                  [disabled]="loginForm.invalid || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!loading" class="fas fa-sign-in-alt me-2"></i>
                  {{ loading ? 'Entrando...' : 'Entrar' }}
                </button>

                <div *ngIf="error" class="alert alert-danger text-center">
                  <i class="fas fa-exclamation-circle me-2"></i>
                  {{ error }}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .min-vh-100 {
      background: linear-gradient(135deg, var(--mustang-blue) 0%, #1a4480 100%);
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // If user is already logged in, redirect
    if (this.authService.isLoggedIn()) {
      this.redirectUser();
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.error = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.redirectUser();
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message || 'Erro ao fazer login. Tente novamente.';
        }
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  private redirectUser(): void {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/start']);
    }
  }
}