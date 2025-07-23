import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
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

              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="name" class="form-label fw-semibold">
                    <i class="fas fa-user me-2"></i>Nome Completo
                  </label>
                  <input 
                    type="text" 
                    class="form-control"
                    id="name"
                    formControlName="name"
                    [class.is-invalid]="isFieldInvalid('name')"
                    placeholder="Digite seu nome completo">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('name')">
                    Nome é obrigatório
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label fw-semibold">
                    <i class="fas fa-envelope me-2"></i>Email
                  </label>
                  <input 
                    type="email" 
                    class="form-control"
                    id="email"
                    formControlName="email"
                    [class.is-invalid]="isFieldInvalid('email')"
                    placeholder="Digite seu email">
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
                    Por favor, insira um email válido
                  </div>
                </div>

                <div class="mb-3">
                  <label for="username" class="form-label fw-semibold">
                    <i class="fas fa-user-circle me-2"></i>Usuário
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
                  [disabled]="registerForm.invalid || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!loading" class="fas fa-user-plus me-2"></i>
                  {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
                </button>

                <div *ngIf="error" class="alert alert-danger text-center">
                  <i class="fas fa-exclamation-circle me-2"></i>
                  {{ error }}
                </div>
              </form>

              <div class="text-center mt-3">
                <a href="/login" class="text-decoration-none">
                  <small>Já tem uma conta? Faça login</small>
                </a>
              </div>
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
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';
      
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/start']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.message || 'Erro ao cadastrar. Por favor, tente novamente.';
        }
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}