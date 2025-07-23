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
        //BARRA DE PROGRESSÃO
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

        <!-- SELECIONADOR DE QUESTOES -->
        <div class="row justify-content-center" *ngIf="currentQuestion">
          <div class="col-12 col-lg-10">
            <div class="mustang-card p-5 fade-in">
              <!--mostrador de imagem ou modelo 3D -->
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

                  <!--questionario-->
                  <div class="answer-options">
                    <div 
                      *ngFor="let option of currentQuestion.options; let i = index"
                      class="quiz-option"
                      [class.selected]="selectedAnswer === option"
                      [class.correct]="showResults && option === currentQuestion.answer"
                      [class.incorrect]="showResults && selectedAnswer === option && option !== currentQuestion.answer"
                      [class.disabled]="showResults"
                      (click)="selectAnswer(option)"
                      [style.pointer-events]="showResults || selectedAnswer ? 'none' : 'auto'">
                      <div class="d-flex align-items-center">
                        <span class="badge bg-primary me-3">{{ getLetter(i) }}</span>
                        <span>{{ option }}</span>
                        <i *ngIf="showResults && option === currentQuestion.answer" 
                           class="fas fa-check-circle text-success ms-auto"></i>
                        <i *ngIf="showResults && selectedAnswer === option && option !== currentQuestion.answer" 
                           class="fas fa-times-circle text-danger ms-auto"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- resultados e curiosidades -->
              <div *ngIf="showResults" class="mt-4 fade-in">
                <div class="alert" [class.alert-success]="isCurrentAnswerCorrect" [class.alert-danger]="!isCurrentAnswerCorrect">
                  <h5 class="alert-heading">
                    <i [class]="isCurrentAnswerCorrect ? 'fas fa-check-circle' : 'fas fa-times-circle'" class="me-2"></i>
                    {{ isCurrentAnswerCorrect ? 'Correto!' : 'Incorreto!' }}
                  </h5>
                  <p class="mb-0">
                    {{ isCurrentAnswerCorrect ? 'Parabéns! Você conhece bem a história do Mustang.' : 'A resposta correta é: ' + currentQuestion.answer }}
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
            </div>
          </div>
        </div>

        <!-- display de pontuação -->
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

  <!--carregamento-->
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
    
    @keyframes slideIn {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class QuizComponent implements OnInit, OnDestroy {
  currentSession: QuizSession | null = null;
  currentQuestion: Question | null = null;
  currentQuestionIndex = 0;
  totalQuestions = 15;

  selectedAnswer = '';
  showResults = false;
  isCurrentAnswerCorrect = false;
  isLastQuestion = false;

  timeLeft = 15;
  timerSubscription?: Subscription;
  questionStartTime = 0;

  constructor(
    private quizService: QuizService,
    private authService: AuthService,
    private router: Router
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
    this.selectedAnswer = '';
    this.showResults = false;
    this.isCurrentAnswerCorrect = false;
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
    if (!this.showResults) {
      if (!this.selectedAnswer && this.currentQuestion) {
        this.selectedAnswer = this.currentQuestion.options[0];
      }
      this.submitAnswer();
    }
  }

  selectAnswer(answer: string): void {
    if (!this.showResults && !this.selectedAnswer) {
      this.selectedAnswer = answer;
      this.submitAnswer();
    }
  }

  private submitAnswer(): void {
    if (!this.currentQuestion || !this.selectedAnswer) return;

    this.stopTimer();

    const timeSpent = Math.round((Date.now() - this.questionStartTime) / 1000);
    const answer: UserAnswer = {
      questionId: this.currentQuestion.id,
      selectedAnswer: this.selectedAnswer,
      isCorrect: this.selectedAnswer === this.currentQuestion.answer,
      timeSpent,
      question: this.currentQuestion.question,
      correctAnswer: this.currentQuestion.answer
    };

    this.quizService.submitAnswer(answer).subscribe({
      next: (isCorrect) => {
        this.isCurrentAnswerCorrect = isCorrect;
        this.showResults = true;
      },
      error: (error) => {
        console.error('Error submitting answer:', error);
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
}
