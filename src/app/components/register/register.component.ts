import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-page-wrapper">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6 col-lg-4">
            <div class="mustang-card p-4 fade-in">
              <div class="text-center mb-4">
                <img src="assets/mustang_vetor2.png" alt="Logo Mustang" class="mb-3" style="height: 65px;">
                <h2 class="fw-bold mb-2">Mustang Quiz</h2>
                <p class="text-muted">60 Anos de História</p>
              </div>

              <!-- FORMULARIO DE CADASTRO -->
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" *ngIf="!showResetPassword">
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

                <div class="mb-4 form-check">
                  <input 
                    type="checkbox" 
                    class="form-check-input" 
                    id="terms"
                    formControlName="terms"
                    [class.is-invalid]="isFieldInvalid('terms')">
                  <label class="form-check-label" for="terms">
                    Eu li e concordo com os <a href="#" class="text-decoration-none" (click)="openTermsModal($event)">Termos de Serviço</a> e <a href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" class="text-decoration-none">Política de Privacidade</a>
                  </label>
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('terms')">
                    Você deve aceitar os termos e condições para se registrar
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

              <!-- FORMULARIO DE RESET DE SENHA -->
              <form [formGroup]="resetForm" (ngSubmit)="onResetPassword()" *ngIf="showResetPassword">
                <div class="mb-3">
                  <label for="identifier" class="form-label fw-semibold">
                    <i class="fas fa-search me-2"></i>Email ou Usuário
                  </label>
                  <input 
                    type="text" 
                    class="form-control"
                    id="identifier"
                    formControlName="identifier"
                    [class.is-invalid]="isResetFieldInvalid('identifier')"
                    placeholder="Digite seu email ou usuário">
                  <div class="invalid-feedback" *ngIf="isResetFieldInvalid('identifier')">
                    Email ou usuário é obrigatório
                  </div>
                </div>

                <div class="mb-4">
                  <label for="newPassword" class="form-label fw-semibold">
                    <i class="fas fa-key me-2"></i>Nova Senha
                  </label>
                  <input 
                    type="password" 
                    class="form-control"
                    id="newPassword"
                    formControlName="newPassword"
                    [class.is-invalid]="isResetFieldInvalid('newPassword')"
                    placeholder="Digite sua nova senha">
                  <div class="invalid-feedback" *ngIf="isResetFieldInvalid('newPassword')">
                    Nova senha é obrigatória (mínimo 4 caracteres)
                  </div>
                </div>

                <button 
                  type="submit" 
                  class="btn btn-mustang w-100 mb-3"
                  [disabled]="resetForm.invalid || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!loading" class="fas fa-key me-2"></i>
                  {{ loading ? 'Redefinindo...' : 'Redefinir Senha' }}
                </button>

                <div *ngIf="error" class="alert alert-danger text-center">
                  <i class="fas fa-exclamation-circle me-2"></i>
                  {{ error }}
                </div>

                <div *ngIf="resetSuccess" class="alert alert-success text-center">
                  <i class="fas fa-check-circle me-2"></i>
                  {{ resetSuccess }}
                </div>
              </form>
              <div class="text-center mt-3">
                <a routerLink="/login" class="text-decoration-none" *ngIf="!showResetPassword">
                  <small>Já tem uma conta? Faça login</small>
                </a>
                
                <div *ngIf="!showResetPassword">
                  <a href="#" class="text-decoration-none d-block mt-2" (click)="toggleResetPassword($event)">
                    <small>Esqueci minha senha</small>
                  </a>
                </div>
                
                <div *ngIf="showResetPassword">
                  <a href="#" class="text-decoration-none" (click)="toggleResetPassword($event)">
                    <small>Voltar ao cadastro</small>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        <!-- MODAL PARA OS TERMOS DE SERVICO -->
      <!-- Modal para os Termos de Serviço -->
      <div class="modal-backdrop" *ngIf="showTermsModal" (click)="closeTermsModal()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h5 class="modal-title">Termos de Serviço - Mustang Quiz</h5>
            <button type="button" class="btn-close" (click)="closeTermsModal()" aria-label="Close"></button>
          </div>
          <div class="modal-body" style="white-space: pre-line;">
            <p><strong>1. Aceitação dos Termos</strong><br>
            Ao se registrar no Mustang Quiz, você concorda com estes Termos de Serviço e com nossa Política de Privacidade. Este quiz foi criado para testar seu conhecimento sobre a história do Ford Mustang em comemoração aos seus 60 anos.</p>

            <p><strong>2. Coleta e Uso de Dados</strong><br>
            Para participar do quiz, coletamos as seguintes informações pessoais:<br><br>
            <strong>Nome completo</strong>: Utilizado para personalizar sua experiência no quiz e identificar seu perfil.<br><br>
            <strong>Endereço de e-mail</strong>: Utilizado para fins de autenticação e comunicação sobre o quiz.<br><br>
            Estes dados são armazenados localmente no seu navegador através do <strong>localStorage</strong>, uma tecnologia padrão da web que permite armazenamento temporário no seu dispositivo.</p>

            <p><strong>3. Armazenamento no localStorage</strong><br>
            Seus dados pessoais (nome e e-mail) são armazenados no localStorage do seu navegador, o que significa que:<br><br>
            - Os dados persistem mesmo quando você fecha o navegador<br>
            - São acessíveis apenas no dispositivo e navegador onde foram registrados<br>
            - Podem ser removidos a qualquer momento limpando os dados do navegador</p>

            <p><strong>4. Segurança dos Dados</strong><br>
            Embora utilizemos o localStorage para armazenamento local:<br><br>
            - Não coletamos ou armazenamos suas informações em nossos servidores<br>
            - Recomendamos não utilizar dispositivos compartilhados para registro<br>
            - Você é responsável pela segurança do dispositivo onde os dados estão armazenados</p>

            <p><strong>5. Finalidade dos Dados</strong><br>
            Seus dados serão utilizados exclusivamente para:<br><br>
            - Criar e gerenciar sua conta no quiz<br>
            - Registrar seu progresso e pontuações<br>
            - Personalizar sua experiência de usuário</p>

            <p><strong>6. Direitos do Usuário</strong><br>
            Você pode a qualquer momento:<br><br>
            - Visualizar os dados armazenados no localStorage do seu navegador<br>
            - Remover completamente seus dados limpando o localStorage<br>
            - Desistir de participar do quiz, removendo seus dados manualmente</p>

            <p><strong>7. Limitações de Responsabilidade</strong><br>
            O Mustang Quiz não se responsabiliza por:<br><br>
            - Perda de dados devido à limpeza do localStorage pelo usuário ou navegador<br>
            - Acesso não autorizado em dispositivos compartilhados ou públicos<br>
            - Alterações técnicas no navegador que afetem o armazenamento local</p>

            <p><strong>8. Alterações nos Termos</strong><br>
            Estes termos podem ser atualizados periodicamente. Recomendamos verificar esta página regularmente para estar ciente de quaisquer mudanças.</p>

            <p><strong>9. Contato</strong><br>
            Para quaisquer dúvidas sobre estes termos ou tratamento de dados, entre em contato através do e-mail: quizfordmustang&#64;gmail.com</p>

            <p>Ao marcar a caixa de aceitação dos termos, você confirma que leu, compreendeu e concordou com todas as condições aqui estabelecidas.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-mustang" (click)="closeTermsModal()">Entendi</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-page-wrapper {
      background: linear-gradient(135deg, var(--mustang-blue) 0%, #1a4480 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      padding-bottom: 5rem;
    }

    /* ESTILOS DO MODAL PERSONALIZADO */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1050;
    }

    .modal-container {
      background: white;
      border-radius: 15px;
      width: 90%;
      max-width: 800px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      background-color: var(--mustang-blue);
      color: white;
      padding: 1rem;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-body {
      padding: 1.5rem;
      line-height: 1.6;
    }

    .modal-footer {
      padding: 1rem;
      border-top: 1px solid #dee2e6;
      display: flex;
      justify-content: flex-end;
    }

    .btn-close {
      background: none;
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  resetForm: FormGroup;
  loading = false;
  error = '';
  showTermsModal = false;
  showResetPassword = false;
  resetSuccess = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // FORMULARIO DE CADASTRO
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });

    // FORMULARIO DE RESET DE SENHA
    this.resetForm = this.fb.group({
      identifier: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  openTermsModal(event: Event) {
    event.preventDefault();
    this.showTermsModal = true;
  }

  closeTermsModal() {
    this.showTermsModal = false;
  }

  toggleResetPassword(event: Event) {
    event.preventDefault();
    this.showResetPassword = !this.showResetPassword;
    this.error = '';
    this.resetSuccess = '';
    
    // LIMPA OS FORMULARIOS AO ALTERNAR
    this.registerForm.reset();
    this.resetForm.reset();
    
    // REDEFINE VALORES PADRAO DO FORMULARIO DE CADASTRO
    if (!this.showResetPassword) {
      this.registerForm.patchValue({
        terms: false
      });
    }
  }
  onSubmit() {
    if (this.registerForm.valid && !this.loading) {
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

  onResetPassword() {
    if (this.resetForm.valid && !this.loading) {
      this.loading = true;
      this.error = '';
      this.resetSuccess = '';

      const { identifier, newPassword } = this.resetForm.value;

      this.authService.resetPassword(identifier, newPassword).subscribe({
        next: (response) => {
          this.loading = false;
          this.resetSuccess = response.message;
          
          // LIMPA O FORMULARIO APOS SUCESSO
          this.resetForm.reset();
          
          // REDIRECIONA PARA LOGIN APOS 2 SEGUNDOS
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.message || 'Erro ao redefinir senha. Tente novamente.';
        }
      });
    }
  }
  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
  isResetFieldInvalid(field: string): boolean {
    const control = this.resetForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }