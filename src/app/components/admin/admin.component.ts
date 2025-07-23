import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QuizService } from '../../services/quiz.service';
import { Question } from '../../models/question.model';
import { QuizResult } from '../../models/result.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="main-container">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="mustang-card p-4 mb-4">
              <h1 class="fw-bold mb-3">
                <i class="fas fa-cog me-2"></i>
                Painel Administrativo
              </h1>
              <p class="lead mb-0">
                Gerencie perguntas do quiz e visualize resultados dos usuários.
              </p>
            </div>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-12">
            <ul class="nav nav-tabs" id="adminTabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button 
                  class="nav-link active"
                  id="questions-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#questions"
                  type="button"
                  role="tab">
                  <i class="fas fa-question-circle me-2"></i>
                  Gerenciar Perguntas ({{ questions.length }})
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button 
                  class="nav-link"
                  id="results-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#results"
                  type="button"
                  role="tab">
                  <i class="fas fa-chart-bar me-2"></i>
                  Resultados dos Usuários ({{ results.length }})
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button 
                  class="nav-link"
                  id="settings-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#settings"
                  type="button"
                  role="tab">
                  <i class="fas fa-sliders-h me-2"></i>
                  Configurações
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div class="tab-content" id="adminTabsContent">
          <div class="tab-pane fade show active" id="questions" role="tabpanel">
            <div class="row">
              <div class="col-lg-4">
                <div class="mustang-card p-4 admin-card">
                  <h4 class="fw-bold mb-3">
                    <i class="fas fa-plus-circle me-2"></i>
                    {{ editingQuestion ? 'Editar' : 'Nova' }} Pergunta
                  </h4>
                  
                  <form [formGroup]="questionForm" (ngSubmit)="saveQuestion()">
                    <div class="mb-3">
                      <label class="form-label fw-semibold">Pergunta</label>
                      <textarea 
                        class="form-control"
                        formControlName="question"
                        rows="3"
                        placeholder="Digite a pergunta..."></textarea>
                    </div>

                    <div class="mb-3">
                      <label class="form-label fw-semibold">Opções de Resposta</label>
                      <div formArrayName="options">
                        <div *ngFor="let option of getOptionsControls(); let i = index" class="mb-2">
                          <div class="input-group">
                            <span class="input-group-text">{{ getLetter(i) }}</span>
                            <input 
                              type="text" 
                              class="form-control"
                              [formControlName]="i"
                              [placeholder]="'Opção ' + getLetter(i)">
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label fw-semibold">Resposta Correta</label>
                      <select class="form-select" formControlName="answer">
                        <option value="">Selecione a resposta correta</option>
                        <option *ngFor="let option of getOptionsValues(); let i = index" [value]="option">
                          {{ getLetter(i) }} - {{ option }}
                        </option>
                      </select>
                    </div>

                    <div class="mb-3">
                      <label class="form-label fw-semibold">Tipo de Mídia</label>
                      <select class="form-select" formControlName="mediaType">
                        <option value="image">Imagem</option>
                        <option value="3d">Modelo 3D</option>
                      </select>
                    </div>

                    <div class="mb-3" *ngIf="questionForm.get('mediaType')?.value === 'image'">
                      <label class="form-label fw-semibold">Arquivo de Imagem</label>
                      <input 
                        type="file" 
                        class="form-control"
                        accept=".png,.jpg,.jpeg"
                        (change)="onFileSelected($event)">
                    </div>

                    <div class="mb-3" *ngIf="questionForm.get('mediaType')?.value === '3d'">
                      <label class="form-label fw-semibold">Arquivo de Modelo 3D</label>
                      <input 
                        type="file" 
                        class="form-control"
                        accept=".glb,.circ,.gltf"
                        (change)="onFileSelected($event)">
                    </div>

                    <input type="hidden" formControlName="mediaUrl">

                    <div class="mb-3">
                      <label class="form-label fw-semibold">Curiosidade</label>
                      <textarea 
                        class="form-control"
                        formControlName="curiosity"
                        rows="3"
                        placeholder="Fato interessante sobre a resposta..."></textarea>
                    </div>

                    <div class="mb-3">
                      <label class="form-label fw-semibold">Ano</label>
                      <input 
                        type="number" 
                        class="form-control"
                        formControlName="year"
                        placeholder="1964"
                        min="1964"
                        max="2025">
                    </div>

                    <div class="mb-3">
                      <label class="form-label fw-semibold">Dificuldade</label>
                      <select class="form-select" formControlName="difficulty">
                        <option value="easy">Fácil</option>
                        <option value="medium">Médio</option>
                        <option value="hard">Difícil</option>
                      </select>
                    </div>

                    <div class="d-grid gap-2">
                      <button 
                        type="submit" 
                        class="btn btn-mustang"
                        [disabled]="questionForm.invalid || saving">
                        <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
                        <i *ngIf="!saving" [class]="editingQuestion ? 'fas fa-save' : 'fas fa-plus'" class="me-2"></i>
                        {{ saving ? 'Salvando...' : (editingQuestion ? 'Atualizar' : 'Adicionar') }}
                      </button>
                      
                      <button 
                        *ngIf="editingQuestion"
                        type="button" 
                        class="btn btn-secondary"
                        (click)="cancelEdit()">
                        <i class="fas fa-times me-2"></i>
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div class="col-lg-8">
                <div class="mustang-card p-4">
                  <h4 class="fw-bold mb-3">
                    <i class="fas fa-list me-2"></i>
                    Lista de Perguntas
                  </h4>
                  
                  <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Pergunta</th>
                          <th>Ano</th>
                          <th>Dificuldade</th>
                          <th>Mídia</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let question of questions">
                          <td>{{ question.id }}</td>
                          <td>
                            <div class="text-truncate" style="max-width: 300px;" [title]="question.question">
                              {{ question.question }}
                            </div>
                          </td>
                          <td>{{ question.year || '-' }}</td>
                          <td>
                            <span class="badge" 
                                  [class.bg-success]="question.difficulty === 'easy'"
                                  [class.bg-warning]="question.difficulty === 'medium'"
                                  [class.bg-danger]="question.difficulty === 'hard'">
                              {{ getDifficultyLabel(question.difficulty) }}
                            </span>
                          </td>
                          <td>
                            <i [class]="question.mediaType === '3d' ? 'fas fa-cube' : 'fas fa-image'" 
                               [title]="question.mediaType === '3d' ? 'Modelo 3D' : 'Imagem'"></i>
                          </td>
                          <td>
                            <div class="btn-group btn-group-sm">
                              <button 
                                class="btn btn-outline-primary"
                                (click)="editQuestion(question)"
                                title="Editar">
                                <i class="fas fa-edit"></i>
                              </button>
                              <button 
                                class="btn btn-outline-danger"
                                (click)="deleteQuestion(question.id)"
                                title="Excluir">
                                <i class="fas fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="results" role="tabpanel">
            <div class="row">
              <div class="col-12">
                <div class="mustang-card p-4">
                  <h4 class="fw-bold mb-3">
                    <i class="fas fa-chart-bar me-2"></i>
                    Resultados dos Usuários
                  </h4>
                  
                  <div class="table-responsive">
                    <table class="table table-hover">
                      <thead>
                        <tr>
                          <th>Usuário</th>
                          <th>Pontuação</th>
                          <th>Porcentagem</th>
                          <th>Tempo</th>
                          <th>Data</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let result of results">
                          <td>{{ result.userName }}</td>
                          <td>{{ result.score }} / {{ result.totalQuestions }}</td>
                          <td>
                            <span class="badge"
                                  [class.bg-danger]="result.percentage < 50"
                                  [class.bg-warning]="result.percentage >= 50 && result.percentage < 70"
                                  [class.bg-success]="result.percentage >= 70">
                              {{ result.percentage }}%
                            </span>
                          </td>
                          <td>{{ formatTime(result.timeSpent) }}</td>
                          <td>{{ formatDate(result.completedAt) }}</td>
                          <td>
                            <button 
                              class="btn btn-outline-info btn-sm"
                              (click)="viewResultDetails(result)"
                              title="Ver detalhes">
                              <i class="fas fa-eye"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="settings" role="tabpanel">
            <div class="row">
              <div class="col-md-6">
                <div class="mustang-card p-4">
                  <h4 class="fw-bold mb-3">
                    <i class="fas fa-sliders-h me-2"></i>
                    Configurações do Quiz
                  </h4>
                  
                  <div class="mb-3">
                    <div class="form-check form-switch">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        id="allowMultipleAttempts"
                        [(ngModel)]="settings.allowMultipleAttempts">
                      <label class="form-check-label" for="allowMultipleAttempts">
                        Permitir múltiplas tentativas por usuário
                      </label>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold">Tempo por pergunta (segundos)</label>
                    <input 
                      type="number" 
                      class="form-control"
                      [(ngModel)]="settings.timePerQuestion"
                      min="10"
                      max="60">
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold">Número de perguntas por quiz</label>
                    <input 
                      type="number" 
                      class="form-control"
                      [(ngModel)]="settings.questionsPerQuiz"
                      min="5"
                      max="20">
                  </div>

                  <button class="btn btn-mustang" (click)="saveSettings()">
                    <i class="fas fa-save me-2"></i>
                    Salvar Configurações
                  </button>
                </div>
              </div>

              <div class="col-md-6">
                <div class="mustang-card p-4">
                  <h4 class="fw-bold mb-3">
                    <i class="fas fa-chart-pie me-2"></i>
                    Estatísticas Gerais
                  </h4>
                  
                  <div class="row text-center">
                    <div class="col-6 mb-3">
                      <div class="border rounded p-3">
                        <i class="fas fa-question-circle text-primary fs-3 mb-2"></i>
                        <h5 class="fw-bold">{{ questions.length }}</h5>
                        <small class="text-muted">Total de Perguntas</small>
                      </div>
                    </div>
                    
                    <div class="col-6 mb-3">
                      <div class="border rounded p-3">
                        <i class="fas fa-users text-success fs-3 mb-2"></i>
                        <h5 class="fw-bold">{{ getUniqueUsersCount() }}</h5>
                        <small class="text-muted">Usuários Únicos</small>
                      </div>
                    </div>
                    
                    <div class="col-6 mb-3">
                      <div class="border rounded p-3">
                        <i class="fas fa-chart-line text-info fs-3 mb-2"></i>
                        <h5 class="fw-bold">{{ getAverageScore() }}%</h5>
                        <small class="text-muted">Média Geral</small>
                      </div>
                    </div>
                    
                    <div class="col-6 mb-3">
                      <div class="border rounded p-3">
                        <i class="fas fa-trophy text-warning fs-3 mb-2"></i>
                        <h5 class="fw-bold">{{ getHighestScore() }}%</h5>
                        <small class="text-muted">Maior Pontuação</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .main-container {
      padding-top: 100px;
    }
    
    .nav-tabs {
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .nav-tabs .nav-link {
      color: var(--mustang-white);
      border: none;
      border-bottom: 3px solid transparent;
      font-weight: 600;
      background-color: transparent;
      transition: all 0.3s ease;
    }
    
    .nav-tabs .nav-link.active {
      color: var(--black-color);
      background-color: var(--mustang-white);
      border-bottom-color: var(--mustang-blue);
      font-weight: 700;
    }
    
    .nav-tabs .nav-link:hover:not(.active) {
      color: var(--mustang-white);
      opacity: 0.8;
    }
    
    .table th {
      border-top: none;
      font-weight: 600;
      color: var(--mustang-blue);
    }
    
    .btn-group-sm > .btn {
      border-radius: 4px;
    }
  `]
})
export class AdminComponent implements OnInit {
  questionForm: FormGroup;
  questions: Question[] = [];
  results: QuizResult[] = [];
  editingQuestion: Question | null = null;
  saving = false;
  
  settings = {
    allowMultipleAttempts: true,
    timePerQuestion: 15,
    questionsPerQuiz: 15
  };

  constructor(
    private fb: FormBuilder,
    private quizService: QuizService
  ) {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      options: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ]),
      answer: ['', Validators.required],
      mediaType: ['image', Validators.required],
      curiosity: ['', Validators.required],
      year: [new Date().getFullYear(), [Validators.min(1964), Validators.max(2025)]],
      difficulty: ['medium', Validators.required],
      mediaUrl: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadQuestions();
    this.loadResults();
  }

  private loadQuestions(): void {
    this.quizService.getQuestions().subscribe({
      next: (questions) => {
        this.questions = questions;
      },
      error: (error) => {
        console.error('Error loading questions:', error);
      }
    });
  }

  private loadResults(): void {
    this.quizService.getResults().subscribe({
      next: (results) => {
        this.results = results.sort((a, b) => 
          new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
        );
      },
      error: (error) => {
        console.error('Error loading results:', error);
      }
    });
  }

  getOptionsControls() {
    return (this.questionForm.get('options') as any).controls;
  }

  getOptionsValues(): string[] {
    return this.questionForm.get('options')?.value || [];
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  getDifficultyLabel(difficulty?: string): string {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return 'Médio';
    }
  }

  saveQuestion(): void {
    if (this.questionForm.valid) {
      this.saving = true;
      const formValue = this.questionForm.value;

      if (this.editingQuestion) {
        const updatedQuestion: Question = {
          ...this.editingQuestion,
          ...formValue
        };

        this.quizService.updateQuestion(updatedQuestion).subscribe({
          next: (question) => {
            this.saving = false;
            this.loadQuestions();
            this.cancelEdit();
          },
          error: (error) => {
            this.saving = false;
            console.error('Error updating question:', error);
          }
        });
      } else {
        this.quizService.addQuestion(formValue).subscribe({
          next: (question) => {
            this.saving = false;
            this.loadQuestions();
            this.questionForm.reset();
            this.questionForm.patchValue({
              mediaType: 'image',
              year: new Date().getFullYear(),
              difficulty: 'medium'
            });
          },
          error: (error) => {
            this.saving = false;
            console.error('Error adding question:', error);
          }
        });
      }
    }
  }

  editQuestion(question: Question): void {
    this.editingQuestion = question;
    this.questionForm.patchValue({
      question: question.question,
      options: question.options,
      answer: question.answer,
      mediaType: question.mediaType,
      mediaUrl: question.mediaUrl,
      curiosity: question.curiosity,
      year: question.year,
      difficulty: question.difficulty
    });
  }

  cancelEdit(): void {
    this.editingQuestion = null;
    this.questionForm.reset();
    this.questionForm.patchValue({
      mediaType: 'image',
      year: new Date().getFullYear(),
      difficulty: 'medium'
    });
  }

  deleteQuestion(questionId: number): void {
    if (confirm('Tem certeza que deseja excluir esta pergunta?')) {
      this.quizService.deleteQuestion(questionId).subscribe({
        next: (success) => {
          if (success) {
            this.loadQuestions();
          }
        },
        error: (error) => {
          console.error('Error deleting question:', error);
        }
      });
    }
  }

  viewResultDetails(result: QuizResult): void {
    alert(`Detalhes do resultado:\n\nUsuário: ${result.userName}\nPontuação: ${result.score}/${result.totalQuestions}\nTempo: ${this.formatTime(result.timeSpent)}\nData: ${this.formatDate(result.completedAt)}`);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  saveSettings(): void {
    localStorage.setItem('quizSettings', JSON.stringify(this.settings));
    alert('Configurações salvas com sucesso!');
  }

  getUniqueUsersCount(): number {
    const uniqueUsers = new Set(this.results.map(r => r.userName));
    return uniqueUsers.size;
  }

  getAverageScore(): number {
    if (this.results.length === 0) return 0;
    const sum = this.results.reduce((acc, result) => acc + result.percentage, 0);
    return Math.round(sum / this.results.length);
  }

  getHighestScore(): number {
    if (this.results.length === 0) return 0;
    return Math.max(...this.results.map(r => r.percentage));
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        this.questionForm.patchValue({
          mediaUrl: base64
        });
      };
      reader.readAsDataURL(file);
    }
  }
}