import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { QuizService } from '../../services/quiz.service';
import { AuthService } from '../../services/auth.service';
import { Question, QuizSession, UserAnswer } from '../../models/question.model';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="main-container" *ngIf="currentSession">
      <div class="container">
        <!-- BARRA DE PROGRESSAO -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="mustang-card p-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="fw-semibold">
                  Pergunta {{ currentQuestionIndex + 1 }} de {{ totalQuestions }}
                </span>
                <div class="timer-circle" [style.background]="getTimerBackground()">
                  {{ timeLeft }}
                </div>
              </div>
              <div class="progress" style="height: 8px;">
                <div 
                  class="progress-bar progress-bar-mustang"
                  [style.width.%]="getProgressPercentage()">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CONTAINER DE QUESTOES -->
        <div class="row justify-content-center" *ngIf="currentQuestion">
          <div class="col-12 col-lg-10">
            <div class="mustang-card p-5 fade-in">
              <!-- MOSTRADOR DE IMAGEM OU MODELO 3D -->
              <div class="row mb-4">
                <div class="col-12 col-md-6 order-md-2 mb-3 mb-md-0">
                  <div class="model-viewer-container" *ngIf="currentQuestion.mediaType === '3d'">
                    <model-viewer
                      [src]="currentQuestion.mediaUrl"
                      [alt]="'Mustang - ' + currentQuestion.year"
                      auto-rotate
                      camera-controls
                      interaction-prompt="none">
                    </model-viewer>
                  </div>
                  
                  <div *ngIf="currentQuestion.mediaType === 'image'" class="text-center">
                    <img 
                      [src]="currentQuestion.mediaUrl" 
                      [alt]="'Mustang - ' + currentQuestion.year"
                      class="img-fluid rounded shadow-lg"
                      style="max-height: 300px; object-fit: cover;">
                  </div>
                </div>
                
                <div class="col-12 col-md-6 order-md-1">
                  <h2 class="fw-bold mb-4">{{ currentQuestion.question }}</h2>

                  <!-- OPCOES DE RESPOSTA -->
                  <div class="answer-options">
                    <div 
                      *ngFor="let option of currentQuestion.options; let i = index"
                      class="quiz-option"
                      [class.selected]="selectedAnswer === option && !showResults"
                      [class.correct]="showResults && option === currentQuestion.answer"
                      [class.incorrect]="showResults && selectedAnswer === option && option !== currentQuestion.answer && hasSelectedAnswer"
                      [class.disabled]="showResults"
                      (click)="selectAnswer(option)"
                      [style.pointer-events]="showResults ? 'none' : 'auto'">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-primary me-3">{{ getLetter(i) }}</span>
                        <span>{{ option }}</span>
                        <i *ngIf="showResults && option === currentQuestion.answer" 
                           class="fas fa-check-circle text-success ms-auto"></i>
                        <i *ngIf="showResults && selectedAnswer === option && option !== currentQuestion.answer && hasSelectedAnswer" 
                           class="fas fa-times-circle text-danger ms-auto"></i>
                      </div>
                    </div>
                  </div>

                  <!-- AVISO DE RESPOSTA NAO SELECIONADA -->
                  <div *ngIf="showNoAnswerWarning" class="alert alert-warning mt-3 fade-in">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>Atenção!</strong> Por favor, selecione uma resposta antes de continuar.
                  </div>
                </div>
              </div>

              <!-- RESULTADOS E CURIOSIDADES -->
              <div *ngIf="showResults" class="mt-4 fade-in">
                <div class="alert" 
                     [class.alert-success]="hasSelectedAnswer && isCurrentAnswerCorrect" 
                     [class.alert-danger]="hasSelectedAnswer && !isCurrentAnswerCorrect" 
                     [class.alert-warning]="!hasSelectedAnswer">
                  <h5 class="alert-heading">
                    <i [class]="getResultIcon()" class="me-2"></i>
                    {{ getResultTitle() }}
                  </h5>
                  <p class="mb-0">
                    {{ getResultMessage() }}
                  </p>
                </div>

                <div class="alert alert-info">
                  <h6 class="fw-bold">
                    <i class="fas fa-lightbulb me-2"></i>Curiosidade
                  </h6>
                  <p class="mb-0">{{ currentQuestion.curiosity }}</p>
                </div>

                <div class="text-center">
                  <button class="btn btn-mustang" (click)="nextQuestion()">
                    <i class="fas fa-arrow-right me-2"></i>
                    {{ isLastQuestion ? 'Ver Resultados' : 'Próxima Pergunta' }}
                  </button>
                </div>
              </div>

              <!-- BOTAO PARA AVANCAR SEM RESPOSTA -->
              <div *ngIf="!showResults && !hasSelectedAnswer && timeLeft > 0 && !answerSubmitted" class="text-center mt-4">
                <button class="btn btn-mustang" (click)="attemptToAdvance()">
                  <i class="fas fa-arrow-right me-2"></i>
                  {{ isLastQuestion ? 'Finalizar Quiz' : 'Próxima Pergunta' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- DISPLAY DE PONTUACAO -->
        <div class="row mt-4">
          <div class="col-12">
            <div class="mustang-card p-3 text-center">
              <h5 class="mb-0">
                <i class="fas fa-star text-warning me-2"></i>
                Pontuação: {{ currentSession.score }} / {{ currentQuestionIndex + (showResults ? 1 : 0) }}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TELA DE CARREGAMENTO -->
    <div *ngIf="!currentSession" class="main-container">
      <div class="container text-center">
        <div class="loading-spinner"></div>
        <p class="mt-3">Carregando quiz...</p>
      </div>
    </div>
  `,
  styles: [`
    .main-container {
      padding-top: 100px;
    }
    
    .answer-options {
      max-height: 400px;
      overflow-y: auto;
    }
    
    .quiz-option {
      transition: all 0.3s ease;
      animation: slideIn 0.5s ease-out;
    }
    
    .timer-circle {
      transition: all 0.3s ease;
    }

    .alert.fade-in {
      animation: fadeIn 0.5s ease-in;
    }
    
    @keyframes slideIn {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class QuizComponent implements OnInit, OnDestroy {
  currentSession: QuizSession | null = null;
  currentQuestion: Question | null = null;
  currentQuestionIndex = 0;
  totalQuestions = 15;

  selectedAnswer: string | null = null;
  showResults = false;
  isCurrentAnswerCorrect = false;
  isLastQuestion = false;
  answerSubmitted = false;

  timeLeft = 15;
  timerSubscription?: Subscription;
  questionStartTime = 0;

  constructor(
    private quizService: QuizService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentSession();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private loadCurrentSession(): void {
    this.quizService.currentSession$.subscribe(session => {
      if (session) {
        this.currentSession = session;
        this.currentQuestionIndex = session.currentQuestionIndex;
        this.totalQuestions = session.questions.length;
        this.currentQuestion = session.questions[this.currentQuestionIndex];
        this.isLastQuestion = this.currentQuestionIndex === this.totalQuestions - 1;
        this.resetQuestion();
      } else {
        this.router.navigate(['/start']);
      }
    });
  }

  private resetQuestion(): void {
    this.selectedAnswer = null;
    this.showResults = false;
    this.isCurrentAnswerCorrect = false;
    this.answerSubmitted = false;
    this.questionStartTime = Date.now();
    this.startTimer();
  }

  private startTimer(): void {
    this.timeLeft = 15;
    this.stopTimer();

    this.timerSubscription = interval(1000).subscribe(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.timeUp();
      }
    });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = undefined;
    }
  }

  private timeUp(): void {
    if (!this.answerSubmitted) {
      this.submitAnswer();
    }
  }

  selectAnswer(answer: string): void {
    // Permite seleção para qualquer usuário logado (admin ou normal)
    if (!this.answerSubmitted && !this.showResults && this.authService.canTakeQuiz()) {
      this.selectedAnswer = answer;
      this.submitAnswer();
    }
  }

  private submitAnswer(): void {
    if (!this.currentQuestion || this.answerSubmitted) return;

    // Garante que o feedback funcione para todos os tipos de usuário
    this.answerSubmitted = true;
    this.stopTimer();

    const timeSpent = Math.round((Date.now() - this.questionStartTime) / 1000);
    
    const answer: UserAnswer = {
      questionId: this.currentQuestion.id,
      selectedAnswer: this.selectedAnswer,
      isCorrect: this.selectedAnswer !== null && this.selectedAnswer === this.currentQuestion!.answer,
      timeSpent,
      question: this.currentQuestion.question,
      correctAnswer: this.currentQuestion.answer,
      wasAnswered: this.selectedAnswer !== null
    };

    this.quizService.submitAnswer(answer).subscribe({
      next: (isCorrect) => {
        // Feedback deve aparecer independente do tipo de usuário
        this.isCurrentAnswerCorrect = this.selectedAnswer !== null && isCorrect;
        this.showResults = true;
      },
      error: (error) => {
        console.error('Error submitting answer:', error);
        // Mesmo em caso de erro, mostra o feedback
        this.isCurrentAnswerCorrect = this.selectedAnswer !== null && this.selectedAnswer === this.currentQuestion!.answer;
        this.showResults = true;
      }
    });
  }

  nextQuestion(): void {
    if (this.isLastQuestion) {
      this.finishQuiz();
    } else {
      this.quizService.nextQuestion().subscribe({
        next: (nextQuestion) => {
          if (nextQuestion) {
            this.currentQuestion = nextQuestion;
            this.currentQuestionIndex++;
            this.isLastQuestion = this.currentQuestionIndex === this.totalQuestions - 1;
            this.resetQuestion();
          } else {
            this.finishQuiz();
          }
        },
        error: (error) => {
          console.error('Error getting next question:', error);
        }
      });
    }
  }

  private finishQuiz(): void {
    this.quizService.finishQuiz().subscribe({
      next: (result) => {
        this.router.navigate(['/result'], { 
          state: { result } 
        });
      },
      error: (error) => {
        console.error('Error finishing quiz:', error);
        this.router.navigate(['/start']);
      }
    });
  }

  getProgressPercentage(): number {
    const completed = this.currentQuestionIndex + (this.showResults ? 1 : 0);
    return (completed / this.totalQuestions) * 100;
  }

  getTimerBackground(): string {
    const percentage = (this.timeLeft / 15) * 360;
    return `conic-gradient(var(--mustang-blue) ${percentage}deg, #E9ECEF ${percentage}deg)`;
  }

  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }

  getResultIcon(): string {
    return this.isCurrentAnswerCorrect ? 'fas fa-check-circle' : 'fas fa-times-circle';
  }

  getResultTitle(): string {
    return this.isCurrentAnswerCorrect ? '✔️ Correto!' : '❌ Incorreto!';
  }

  getResultMessage(): string {
    if (this.isCurrentAnswerCorrect) {
      return 'Parabéns! Você conhece bem a história do Mustang.';
    } else {
      return 'A resposta correta é: ' + this.currentQuestion?.answer;
    }
  }
}